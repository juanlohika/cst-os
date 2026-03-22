import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProcessFlowsService } from './process-flows.service';
import { ProcessFlowType } from '@prisma/client';

class CreateProcessFlowDto {
  @ApiProperty() @IsString() projectId: string;
  @ApiProperty() @IsString() clientId: string;
  @ApiProperty() @IsString() title: string;
  @ApiProperty({ enum: ProcessFlowType }) @IsEnum(ProcessFlowType) flowType: ProcessFlowType;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsOptional() @IsString() brdId?: string;
  @ApiProperty() @IsOptional() @IsString() meetingId?: string;
  @ApiProperty() @IsOptional() @IsString() sourceText?: string;
  @ApiProperty() @IsOptional() @IsString() diagramDefinition?: string;
}

class UpdateProcessFlowDto {
  @ApiProperty() @IsOptional() @IsString() title?: string;
  @ApiProperty() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsOptional() @IsString() diagramDefinition?: string;
  @ApiProperty() @IsOptional() @IsString() sourceText?: string;
  @ApiProperty() @IsOptional() @IsString() status?: string;
}

class QueryProcessFlowsDto {
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsEnum(ProcessFlowType) flowType?: ProcessFlowType;
  @IsOptional() @Type(() => Number) page?: number;
  @IsOptional() @Type(() => Number) limit?: number;
}

@ApiTags('Process Flows')
@ApiBearerAuth()
@Controller('process-flows')
export class ProcessFlowsController {
  constructor(private readonly processFlowsService: ProcessFlowsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a process flow' })
  create(@Body() dto: CreateProcessFlowDto, @CurrentUser() user: any) {
    return this.processFlowsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List process flows' })
  findAll(@Query() query: QueryProcessFlowsDto) {
    return this.processFlowsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get process flow detail' })
  findOne(@Param('id') id: string) {
    return this.processFlowsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a process flow' })
  update(@Param('id') id: string, @Body() dto: UpdateProcessFlowDto) {
    return this.processFlowsService.update(id, dto);
  }
}
