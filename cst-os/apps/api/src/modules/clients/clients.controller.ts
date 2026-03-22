import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';

@ApiTags('Clients')
@ApiBearerAuth()
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a client' })
  create(@Body() dto: CreateClientDto, @CurrentUser() user: any) {
    return this.clientsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List all clients (paginated, filterable)' })
  findAll(@Query() query: QueryClientsDto) {
    return this.clientsService.findAll(query);
  }

  @Get('export')
  @ApiOperation({ summary: 'Export all clients (ERPNext-style)' })
  export() {
    return this.clientsService.exportAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client 360° view' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a client' })
  update(@Param('id') id: string, @Body() dto: UpdateClientDto) {
    return this.clientsService.update(id, dto);
  }

  @Patch(':id/health-score')
  @ApiOperation({ summary: 'Recalculate client health score' })
  recalculateHealth(@Param('id') id: string) {
    return this.clientsService.calculateHealthScore(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mark client as churned (soft delete)' })
  remove(@Param('id') id: string) {
    return this.clientsService.remove(id);
  }

  // ── Contacts ────────────────────────────────────────────────────────────────

  @Get(':id/contacts')
  @ApiOperation({ summary: 'List contacts for a client' })
  findContacts(@Param('id') id: string) {
    return this.clientsService.findContacts(id);
  }

  @Post(':id/contacts')
  @ApiOperation({ summary: 'Add contact to client' })
  createContact(@Param('id') id: string, @Body() body: any) {
    return this.clientsService.createContact(id, body);
  }

  @Patch(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Update client contact' })
  updateContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
    @Body() body: any,
  ) {
    return this.clientsService.updateContact(id, contactId, body);
  }

  @Delete(':id/contacts/:contactId')
  @ApiOperation({ summary: 'Deactivate client contact' })
  deleteContact(
    @Param('id') id: string,
    @Param('contactId') contactId: string,
  ) {
    return this.clientsService.deleteContact(id, contactId);
  }

  // ── CSAT ────────────────────────────────────────────────────────────────────

  @Get('csat')
  @ApiOperation({ summary: 'List all CSAT surveys (optionally filtered by clientId)' })
  listAllCsat(@Query('clientId') clientId?: string) {
    return this.clientsService.listCsat(clientId);
  }

  @Get(':id/csat')
  @ApiOperation({ summary: 'List CSAT surveys for a specific client' })
  listClientCsat(@Param('id') id: string) {
    return this.clientsService.listCsat(id);
  }

  @Post(':id/csat')
  @ApiOperation({ summary: 'Log a CSAT survey for a client' })
  createCsat(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.clientsService.createCsat({ ...body, clientId: id }, user?.id);
  }

  // ── Courtesy Calls ────────────────────────────────────────────────────────

  @Get('courtesy-calls/compliance')
  @ApiOperation({ summary: 'Get courtesy call compliance for a period (year + month)' })
  getCompliance(
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    const now = new Date();
    return this.clientsService.getCourtesyCallCompliance(
      year ? parseInt(year) : now.getFullYear(),
      month ? parseInt(month) : now.getMonth() + 1,
    );
  }

  @Post(':id/courtesy-calls/log')
  @ApiOperation({ summary: 'Log a courtesy call for a client' })
  logCall(@Param('id') id: string, @Body() body: any, @CurrentUser() user: any) {
    return this.clientsService.logCourtesyCall(id, {
      assignedToId: body.assignedToId ?? user?.id,
      notes: body.notes,
      year: body.year ?? new Date().getFullYear(),
      month: body.month ?? new Date().getMonth() + 1,
    });
  }
}
