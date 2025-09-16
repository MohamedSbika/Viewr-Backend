import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { PlanResponseDto } from './dto/plan-response.dto';

@Controller('plans')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPlanDto: CreatePlanDto): Promise<PlanResponseDto> {
    const plan = await this.planService.create(createPlanDto);
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  @Get()
  async findAll(): Promise<PlanResponseDto[]> {
    const plans = await this.planService.findAll();
    return plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }));
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PlanResponseDto> {
    const plan = await this.planService.findOne(id);
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ): Promise<PlanResponseDto> {
    const plan = await this.planService.update(id, updatePlanDto);
    return {
      id: plan.id,
      name: plan.name,
      price: plan.price,
      isActive: plan.isActive,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.planService.remove(id);
  }
}
