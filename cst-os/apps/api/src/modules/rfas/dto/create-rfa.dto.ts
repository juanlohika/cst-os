import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { RfaRequestType, Priority } from '@prisma/client';

export class CreateRfaDto {
  @ApiProperty()
  @IsString()
  projectId: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiProperty({ enum: RfaRequestType })
  @IsEnum(RfaRequestType)
  requestType: RfaRequestType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: Priority })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedApproverId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  slaDays?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  estimatedEffortHours?: number;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
