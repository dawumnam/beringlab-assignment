import {
  IsAlpha,
  IsDefined,
  IsOptional,
  IsPhoneNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { IsStrongPasswordConstraint } from "../../validator/is-strong-password";
import { Expose } from "class-transformer";

export class CreateDto {
  @Expose()
  @IsDefined({ message: "Phone number is required" })
  @IsString({ message: "Phone number must be string" })
  @IsPhoneNumber("KR", { message: "Phone number is invalid" })
  phoneNumber!: string;

  @Expose()
  @IsDefined({ message: "Id is required" })
  @IsString({ message: "Id must be string" })
  @IsAlpha("en-US", { message: "Id must be alphabet" })
  @MinLength(6, { message: "Id must be longer than 6" })
  @MaxLength(20, { message: "Id must be shorter than 20" })
  userName!: string;

  @Expose()
  @IsDefined({ message: "First name is required" })
  @IsString({ message: "First name must be string" })
  @MaxLength(20, { message: "First name must be shorter than 20" })
  firstName!: string;

  @Expose()
  @IsDefined({ message: "Last name is required" })
  @IsString({ message: "Last name must be string" })
  @MaxLength(20, { message: "Last name must be shorter than 20" })
  lastName!: string;

  @Expose()
  @IsDefined({ message: "Password is required" })
  @IsString({ message: "Password must be string" })
  @MaxLength(12, { message: "Password must be shorter than 12" })
  @MinLength(6, { message: "Password must be longer than 6" })
  @Validate(IsStrongPasswordConstraint)
  password!: string;
}

export class VerifyDto {
  @Expose()
  @IsDefined({ message: "Id is required" })
  @IsString({ message: "Id must be string" })
  @IsAlpha("en-US", { message: "Id must be alphabet" })
  @MinLength(6, { message: "Id must be longer than 6" })
  @MaxLength(20, { message: "Id must be shorter than 20" })
  userName!: string;

  @Expose()
  @IsDefined({ message: "Password is required" })
  @IsString({ message: "Password must be string" })
  @MaxLength(12, { message: "Password must be shorter than 12" })
  @MinLength(6, { message: "Password must be longer than 6" })
  @Validate(IsStrongPasswordConstraint)
  password!: string;
}

export class WithdrawDto {
  @Expose()
  @IsDefined({ message: "Id is required" })
  @IsString({ message: "Id must be string" })
  id!: string;

  @Expose()
  @IsDefined({ message: "Amount is required" })
  @IsPositive({ message: "Amount must be positive" })
  amount!: number;

  @Expose()
  @IsOptional()
  @IsString({ message: "Card id must be string" })
  cardId?: string | undefined;
}

export class CheckBalanceDto {
  @Expose()
  @IsDefined({ message: "Id is required" })
  @IsString({ message: "Id must be string" })
  id!: string;
}

export class RegisterDto {
  @Expose()
  @IsDefined({ message: "Account id is required" })
  @IsString({ message: "Account id must be string" })
  accountId!: string;

  @Expose()
  @IsDefined({ message: "Card count is required" })
  @IsPositive({ message: "Card count must be positive" })
  count!: number;
}

export class EnableDto {
  @Expose()
  @IsDefined({ message: "Card id is required" })
  @IsString({ message: "Card id must be string" })
  cardId!: string;

  @Expose()
  @IsDefined({ message: "Account id is required" })
  @IsString({ message: "Account id must be string" })
  accountId!: string;
}

export class DisableDto extends EnableDto {}
export class DepositDto extends WithdrawDto {}
