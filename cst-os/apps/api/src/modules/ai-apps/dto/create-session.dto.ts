import { IsOptional, IsString } from 'class-validator';

export class CreateSessionDto {
  @IsOptional() @IsString() projectId?: string;
  @IsOptional() @IsString() clientId?: string;
  @IsOptional() @IsString() taskId?: string;
  @IsOptional() context?: Record<string, unknown>;
}
