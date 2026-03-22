import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString, IsArray } from 'class-validator';
import { MeetingType } from '@prisma/client';

export class CreateMeetingDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  clientId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ enum: MeetingType })
  @IsEnum(MeetingType)
  meetingType: MeetingType;

  @ApiProperty()
  @IsDateString()
  meetingDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  recordingUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transcriptRaw?: string;

  @ApiPropertyOptional({ description: 'Participant objects (external contacts)' })
  @IsOptional()
  @IsArray()
  participants?: any[];

  @ApiPropertyOptional({ description: 'User IDs to auto-create meeting tasks for' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attendeeIds?: string[];
}
