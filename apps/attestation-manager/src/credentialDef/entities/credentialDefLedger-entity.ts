import { IsString, IsBoolean } from 'class-validator';

export default class CredentialDefLedgerDto {
  @IsString()
  public schemaId: string;

  @IsBoolean()
  public supportRevocation?: boolean;

  @IsString()
  public tag?: string;
}
