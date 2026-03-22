import { Controller, Get, Post, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { BrdsService } from './brds.service';
import { CreateBrdDto } from './dto/create-brd.dto';
import { UpdateBrdDto } from './dto/update-brd.dto';
import { QueryBrdsDto } from './dto/query-brds.dto';

@ApiTags('BRDs')
@ApiBearerAuth()
@Controller('brds')
export class BrdsController {
  constructor(private readonly brdsService: BrdsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a BRD' })
  create(@Body() dto: CreateBrdDto, @CurrentUser() user: any) {
    return this.brdsService.create(dto, user?.id);
  }

  @Get()
  @ApiOperation({ summary: 'List BRDs' })
  findAll(@Query() query: QueryBrdsDto) {
    return this.brdsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get BRD detail' })
  findOne(@Param('id') id: string) {
    return this.brdsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update BRD' })
  update(@Param('id') id: string, @Body() dto: UpdateBrdDto) {
    return this.brdsService.update(id, dto);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit BRD for review' })
  submit(@Param('id') id: string) {
    return this.brdsService.submitForReview(id);
  }

  @Patch(':id/approve')
  @ApiOperation({ summary: 'Approve a BRD' })
  approve(@Param('id') id: string, @CurrentUser() user: any) {
    return this.brdsService.approve(id, user?.id);
  }
}
