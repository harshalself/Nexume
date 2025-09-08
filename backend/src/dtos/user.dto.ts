import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from "class-validator";

export class UserSignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;
}

export class UserSignInDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class UserUpdateDto {
  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  profile_pic?: string;

  @IsOptional()
  @IsString()
  llm_api_key?: string;
}
