import { PartialType } from '@nestjs/mapped-types';
import { CreateRfaDto } from './create-rfa.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateRfaDto extends PartialType(CreateRfaDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  approvalNotes?: string;
}
