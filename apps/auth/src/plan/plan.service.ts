import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanAuth } from '@app/shared';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlanService {
  constructor(
    @InjectRepository(PlanAuth)
    private readonly planRepository: Repository<PlanAuth>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<PlanAuth> {
    const plan = this.planRepository.create(createPlanDto);
    return await this.planRepository.save(plan);
  }

  async findAll(): Promise<PlanAuth[]> {
    return await this.planRepository.find({
      where: { isActive: true },
      relations: ['establishments'],
    });
  }

  async findOne(id: string): Promise<PlanAuth> {
    const plan = await this.planRepository.findOne({
      where: { id, isActive: true },
      relations: ['establishments'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<PlanAuth> {
    const plan = await this.findOne(id);
    Object.assign(plan, updatePlanDto);
    return await this.planRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    plan.isActive = false;
    await this.planRepository.save(plan);
  }
}
