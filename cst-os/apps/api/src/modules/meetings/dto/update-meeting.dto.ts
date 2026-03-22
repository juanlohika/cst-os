import { PartialType } from '@nestjs/mapped-types';
import { CreateMeetingDto } from './create-meeting.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { MeetingStatus } from '@prisma/client';

export class UpdateMeetingDto extends PartialType(CreateMeetingDto) {
  @ApiPropertyOptional({ enum: MeetingStatus })
  @IsOptional()
  @IsEnum(MeetingStatus)
  status?: MeetingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aiSummary?: string;

  @ApiPropertyOptional()
  @IsOptional()
  actionItems?: any;

  @ApiPropertyOptional()
  @IsOptional()
  decisions?: any;

  @ApiPropertyOptional()
  @IsOptional()
  requirements?: any;

  @ApiPropertyOptional()
  @IsOptional()
  painPoints?: any;

  @ApiPropertyOptional()
  @IsOptional()
  risksIdentified?: any;
}
