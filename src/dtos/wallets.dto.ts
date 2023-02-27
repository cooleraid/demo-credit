import { IsEmail, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class FundWalletDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;
}

export class WithdrawFundsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;
}

export class TransferFundsDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  public amount: number;

  @IsNotEmpty()
  @IsEmail()
  public email: string;
}
