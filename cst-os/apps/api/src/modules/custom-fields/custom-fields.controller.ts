import {
  Controller, Get, Post, Patch, Delete, Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomFieldsService } from './custom-fields.service';
import { CreateFieldDto } from './dto/create-field.dto';
import { SetValueDto } from './dto/set-value.dto';

@ApiTags('Custom Fields')
@ApiBearerAuth('JWT')
@Controller('custom-fields')
export class CustomFieldsController {
  constructor(private readonly svc: CustomFieldsService) {}

  @Get()
  @ApiOperation({ summary: 'Get field definitions for an entity type' })
  getDefinitions(@Query('entityType') entityType: string) {
    return this.svc.getDefinitions(entityType);
  }

  @Post()
  @ApiOperation({ summary: 'Create a custom field definition' })
  createDefinition(@Body() dto: CreateFieldDto) {
    return this.svc.createDefinition(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a custom field definition' })
  updateDefinition(@Param('id') id: string, @Body() body: Partial<CreateFieldDto>) {
    return this.svc.updateDefinition(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a custom field definition' })
  deleteDefinition(@Param('id') id: string) {
    return this.svc.deleteDefinition(id);
  }

  @Get('values/:entityId')
  @ApiOperation({ summary: 'Get all custom field values for an entity' })
  getValues(@Param('entityId') entityId: string) {
    return this.svc.getValues(entityId);
  }

  @Post('values')
  @ApiOperation({ summary: 'Set a custom field value' })
  setValue(@Body() dto: SetValueDto) {
    return this.svc.setValue(dto);
  }
}
