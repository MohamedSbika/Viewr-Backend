import { Injectable, Logger, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { AnalysisResponseDto } from '@app/shared';
import { CreateAnalysisDto } from '@app/shared';
import { firstValueFrom } from 'rxjs';
import { UpdateAnalysisDto } from '@app/shared';

@Injectable()
export class AnalysisService {

    private readonly logger = new Logger(AnalysisService.name);

    constructor(
        @Inject('BIOLOGY_SERVICE') private readonly bioClient: ClientProxy
    ) {
        this.logger.log('Analysis Service initialized');
    }

    async create(createAnalysisDto: CreateAnalysisDto): Promise<AnalysisResponseDto> {
        this.logger.log(`Sending request to create analysis: ${JSON.stringify(createAnalysisDto)}`);
        try {
            const newAnalysis = await firstValueFrom(
                this.bioClient.send<AnalysisResponseDto, CreateAnalysisDto>('analysis.create', createAnalysisDto)
            );
            this.logger.log(`Received response for analysis creation: ${JSON.stringify(newAnalysis)}`);
            return newAnalysis;
        } catch (error) {
            this.logger.error(`Error during analysis creation RPC call: ${error}`, error.stack);
            throw new RpcException({
                message: 'Failed to create analysis',
                statusCode: 400
            });
        }
    }

    async findAll(): Promise<AnalysisResponseDto[]> {
        this.logger.log('Sending request to fetch all analysis');
        try {
            const analysis = await firstValueFrom(
                this.bioClient.send<AnalysisResponseDto[]>('analysis.findAll', {})
            );
            this.logger.log(`Received response for fetching all analysis: ${JSON.stringify(analysis)}`);
            return analysis;
        } catch (error) {
            this.logger.error(`Error during fetch all analysis RPC call: ${error.message}`, error.stack);
            if (error instanceof RpcException) ({
                message: 'Failed to fetch analysis',
                statusCode: 500
            })
            throw new RpcException(`Failed to fetch all analysis: ${error.message || error}`);
        }
    }
    async findById(id: string): Promise<AnalysisResponseDto> {

        try {
            const analysis = await firstValueFrom(
                this.bioClient.send<AnalysisResponseDto>('analysis.findOne', { id })
            );
            return analysis;

        } catch (error) {
            this.logger.error(`Error during fetch  analysis RPC call: ${error.message}`, error.stack);
            if (error instanceof RpcException) ({
                message: 'Failed to fetch analysis',
                statusCode: 500
            })
            throw new RpcException(`Failed to fetch  analysis: ${error.message || error}`);
        }
    }
    async updateAnalysis(id: string , data : UpdateAnalysisDto): Promise<AnalysisResponseDto> {

        try {
            const analysis = await firstValueFrom(
                this.bioClient.send<AnalysisResponseDto>('analysis.update', { id, updateAnalysisDto:data })
            );
            return analysis;

        } catch (error) {
            this.logger.error(`Error during fetch  analysis RPC call: ${error.message}`, error.stack);
            if (error instanceof RpcException) ({
                message: 'Failed to fetch analysis',
                statusCode: 500
            })
            throw new RpcException(`Failed to fetch  analysis: ${error.message || error}`);
        }
    }
    async delete(id: string): Promise<AnalysisResponseDto> {

        try {
            const analysis = await firstValueFrom(
                this.bioClient.send<AnalysisResponseDto>('analysis.remove', { id })
            );
            return analysis;

        } catch (error) {
            this.logger.error(`Error during fetch  analysis RPC call: ${error.message}`, error.stack);
            if (error instanceof RpcException) ({
                message: 'Failed to fetch analysis',
                statusCode: 500
            })
            throw new RpcException(`Failed to fetch  analysis: ${error.message || error}`);
        }
    }
}