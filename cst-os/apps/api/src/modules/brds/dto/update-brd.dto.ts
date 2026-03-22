import { PartialType } from '@nestjs/mapped-types';
import { CreateBrdDto } from './create-brd.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { BrdStatus } from '@prisma/client';

export class UpdateBrdDto extends PartialType(CreateBrdDto) {
  @ApiPropertyOptional({ enum: BrdStatus })
  @IsOptional()
  @IsEnum(BrdStatus)
  status?: BrdStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  googleDocId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  googleDocUrl?: string;
}
