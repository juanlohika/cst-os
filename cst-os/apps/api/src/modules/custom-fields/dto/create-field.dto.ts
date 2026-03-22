import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { FieldType } from '@prisma/client';

export class CreateFieldDto {
  @ApiProperty()
  @IsString()
  entityType: string;

  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ enum: FieldType })
  @IsEnum(FieldType)
  fieldType: FieldType;

  @ApiPropertyOptional()
  @IsOptional()
  options?: { value: string; label: string; color: string }[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isRequired?: boolean;
}
