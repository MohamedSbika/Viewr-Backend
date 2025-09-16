export type NotificationType = 'ALL' | 'USER';

export class CreateNotificationDto {
  type: NotificationType;
  message: string;
  establishmentId: string;
  userId?: string;
  sentBy: string;
  createdAt?: string;
}
