import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class JobDescriptionCreateDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  status?: string; // 'active' or 'inactive'
}

export class JobDescriptionUpdateDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
