import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RfasService } from './rfas.service';
import { CreateRfaDto } from './dto/create-rfa.dto';
import { UpdateRfaDto } from './dto/update-rfa.dto';
import { QueryRfasDto } from './dto/query-rfas.dto';

class ApprovalDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  notes?: string;
}

@ApiTags('RFAs')
@ApiBearerAuth()
@Controller('rfas')
export class RfasController {
  constructor(private readonly rfasService: RfasService) {}

  @Post()
  @ApiOperation({ summary: 'Create an RFA' })
  create(@Body() dto: CreateRfaDto, @CurrentUser() user: any) {
    return this.rfasService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List RFAs (paginated, filterable)' })
  findAll(@Query() query: QueryRfasDto) {
    return this.rfasService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get RFA detail' })
  findOne(@Param('id') id: string) {
    return this.rfasService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update RFA' })
  update(@Param('id') id: string, @Body() dto: UpdateRfaDto) {
    return this.rfasService.update(id, dto);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit RFA for review' })
  submit(@Param('id') id: string) {
    return this.rfasService.submit(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve an RFA' })
  approve(@Param('id') id: string, @Body() dto: ApprovalDto, @CurrentUser() user: any) {
    return this.rfasService.approve(id, user?.id, dto.notes);
  }

  @Patch(':id/reject')
  @ApiOperation({ summary: 'Reject an RFA' })
  reject(@Param('id') id: string, @Body() dto: ApprovalDto, @CurrentUser() user: any) {
    return this.rfasService.reject(id, user?.id, dto.notes);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel an RFA' })
  cancel(@Param('id') id: string) {
    return this.rfasService.cancel(id);
  }
}
