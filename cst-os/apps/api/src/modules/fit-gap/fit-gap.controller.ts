import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FitGapService } from './fit-gap.service';
import { FitGapStatus } from '@prisma/client';

class CreateFitGapDto {
  @ApiProperty() @IsString() projectId: string;
  @ApiProperty() @IsString() clientId: string;
  @ApiProperty() @IsOptional() @IsString() meetingId?: string;
  @ApiProperty() @IsOptional() @IsArray() rows?: any[];
}

class UpdateFitGapDto {
  @ApiProperty() @IsOptional() @IsEnum(FitGapStatus) status?: FitGapStatus;
  @ApiProperty() @IsOptional() @IsArray() rows?: any[];
}

class QueryFitGapDto {
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsEnum(FitGapStatus) status?: FitGapStatus;
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
}

@ApiTags('Fit-Gap')
@ApiBearerAuth()
@Controller('fit-gap')
export class FitGapController {
  constructor(private readonly fitGapService: FitGapService) {}

  @Post()
  @ApiOperation({ summary: 'Create a fit-gap analysis' })
  create(@Body() dto: CreateFitGapDto, @CurrentUser() user: any) {
    return this.fitGapService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List fit-gap analyses' })
  findAll(@Query() query: QueryFitGapDto) {
    return this.fitGapService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fit-gap detail' })
  findOne(@Param('id') id: string) {
    return this.fitGapService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update fit-gap rows or status' })
  update(@Param('id') id: string, @Body() dto: UpdateFitGapDto) {
    return this.fitGapService.update(id, dto);
  }
}
