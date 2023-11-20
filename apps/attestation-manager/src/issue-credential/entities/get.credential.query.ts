import { IsBoolean, IsString, IsDateString } from 'class-validator';

export default class GetCredentialQuery {
  @IsString()
  public page?: string;

  @IsString()
  public pageSize?: string;

  @IsString()
  public threadId?: string;

  @IsBoolean()
  public isReceived?: boolean | string;

  @IsString()
  public state?: string;

  @IsString()
  public credDefId?: string;

  @IsDateString()
  public createdDateStart?: string;

  @IsDateString()
  public createdDateEnd?: string;

  @IsDateString()
  public updatedDateStart?: string;

  @IsDateString()
  public updatedDateEnd?: string;

  @IsDateString()
  public expirationDateStart?: string;

  @IsDateString()
  public expirationDateEnd?: string;

  @IsString()
  public connectionId?: string;

  @IsString()
  public principalDid?: string;
}
