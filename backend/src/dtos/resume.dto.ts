import { IsOptional, IsString, IsEmail } from "class-validator";

export class ResumeUploadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ResumeUpdateDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  parsed_data?: string;
}
