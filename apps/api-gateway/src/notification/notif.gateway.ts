
import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer } from '@nestjs/websockets';
import { Logger, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ClientProxy } from '@nestjs/microservices';

@WebSocketGateway(3002,{
    cors: {
        origin: '*', // Allow all origins for CORS
        methods: ['GET', 'POST'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type'], // Allowed headers
        credentials: true, // Allow credentials
    },
})
export class NotifGateway  {
    private static logFilePath = path.join(__dirname, '../../../logs/api-gateway/notif.gateway.log');
    private static fileLogger(message: string) {
        const timestamp = new Date().toISOString();
        const logLine = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(NotifGateway.logFilePath, logLine, { encoding: 'utf8' });
    }
    @WebSocketServer()
    private server: any;
    constructor(
        @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
    ) {}

    async handleConnection(client: any) {
        const userId = client.handshake?.query?.userId;
        const establishmentId = client.handshake?.query?.establishmentId;
        const logMsg = `Client connected with userId: ${userId}, establishmentId: ${establishmentId}`;
        Logger.log(logMsg, 'NotifGateway');
        NotifGateway.fileLogger(logMsg);
        // Send verification request to AUTH_SERVICE
        if (userId && establishmentId) {
            this.authClient.send('notification.verify-user-establishment', { userId, establishmentId }).subscribe({
                next: (result) => {
                    const logMsg = `Verification result: ${JSON.stringify(result)}`;
                    Logger.log(logMsg, 'NotifGateway');
                    NotifGateway.fileLogger(logMsg);
                    if (!result?.valid) {
                        const logMsg = 'User not authorized, disconnecting...';
                        Logger.warn(logMsg, 'NotifGateway');
                        NotifGateway.fileLogger(logMsg);
                        client.disconnect();
                    } else {
                        // Join the client to a room with the establishmentId as the channel name
                        client.join(establishmentId);
                        const logMsg = `User ${userId} joined room: ${establishmentId}`;
                        Logger.log(logMsg, 'NotifGateway');
                        NotifGateway.fileLogger(logMsg);
                    }
                },
                error: (err) => {
                    const logMsg = `user ${userId} not authorized for establishment ${establishmentId}`;
                    Logger.error(logMsg, 'NotifGateway');
                    NotifGateway.fileLogger(logMsg);
                    client.disconnect();
                },
            });
        } else {
            const logMsg = 'Missing userId or establishmentId, disconnecting...';
            Logger.warn(logMsg, 'NotifGateway');
            NotifGateway.fileLogger(logMsg);
            client.disconnect();
        }
    }
    @SubscribeMessage('newMessage')
    handleNewMessage(@MessageBody() data: any): void {
        // Handle incoming messages from clients
        const logMsg = `Received message: ${data}`;
        Logger.log(logMsg, 'NotifGateway');
        NotifGateway.fileLogger(logMsg);
        // Here you can add logic to process the message and send notifications
    }

    /**
     * Sends a notification, stores it via AUTH_SERVICE, and emits to the correct channel.
     * @param notification The notification DTO
     */
    async sendNotification(notification: {
        type: 'ALL' | 'USER',
        message: string,
        establishmentId: string,
        userId?: string,
        sentBy: string,
        createdAt?: string
    }) {
        try {
            // Store notification using auth service
            const storeResult = await this.authClient.send('notification.store', notification).toPromise();
            const logMsg = `Notification store result: ${JSON.stringify(storeResult)}`;
            Logger.log(logMsg, 'NotifGateway');
            NotifGateway.fileLogger(logMsg);
            if (storeResult?.success) {
                if (notification.type === 'ALL') {
                    // Emit to all users in the establishment room
                    this.server.to(notification.establishmentId).emit('notification', notification);
                    const logMsg = `Notification sent to ALL in room: ${notification.establishmentId}`;
                    Logger.log(logMsg, 'NotifGateway');
                    NotifGateway.fileLogger(logMsg);
                } else if (notification.type === 'USER' && notification.userId) {
                    // Emit to a specific user in the establishment room
                    const userChannel = `${notification.establishmentId}:${notification.userId}`;
                    this.server.to(userChannel).emit('notification', notification);
                    const logMsg = `Notification sent to USER in room: ${userChannel}`;
                    Logger.log(logMsg, 'NotifGateway');
                    NotifGateway.fileLogger(logMsg);
                }
            } else {
                const logMsg = 'Notification not stored, not sending.';
                Logger.warn(logMsg, 'NotifGateway');
                NotifGateway.fileLogger(logMsg);
            }
        } catch (error) {
            const logMsg = `Error sending notification: ${error}`;
            Logger.error(logMsg, 'NotifGateway');
            NotifGateway.fileLogger(logMsg);
        }
    }
}
