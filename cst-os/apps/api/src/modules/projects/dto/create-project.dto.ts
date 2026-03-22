import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  ProjectStatus,
  ProjectPhase,
  ProjectType,
  Priority,
  RiskLevel,
  PlanningStatus,
} from '@prisma/client';

export class CreateProjectDto {
  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty()
  @IsString()
  projectName: string;

  @ApiProperty({ enum: ProjectType })
  @IsEnum(ProjectType)
  projectType: ProjectType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  targetGoLiveDate?: string;

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ enum: ProjectPhase })
  @IsOptional()
  @IsEnum(ProjectPhase)
  phase?: ProjectPhase;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lifecycleStage?: string;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedPmId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedManhours?: number;

  @ApiPropertyOptional({ enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel)
  riskLevel?: RiskLevel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  riskNotes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  scopeDescription?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: PlanningStatus })
  @IsOptional()
  @IsEnum(PlanningStatus)
  planningStatus?: PlanningStatus;

  @ApiPropertyOptional()
  @IsOptional()
  projectedVisibility?: any;
}
