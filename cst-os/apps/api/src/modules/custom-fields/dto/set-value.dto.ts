import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetValueDto {
  @ApiProperty()
  @IsString()
  fieldId: string;

  @ApiProperty()
  @IsString()
  entityId: string;

  @ApiPropertyOptional()
  value?: unknown;
}
