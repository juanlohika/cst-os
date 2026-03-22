import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateAppDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsString() claudeMdInstruction?: string;
  @IsOptional() steps?: any;
  @IsOptional() @IsBoolean() isSystemApp?: boolean;
}
