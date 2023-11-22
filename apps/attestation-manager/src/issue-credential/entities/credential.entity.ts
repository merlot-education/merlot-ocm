import { IsString, IsNotEmpty } from 'class-validator';

export default class CredentialDto {
  @IsString()
  @IsNotEmpty()
  public credentialId: string;

  @IsString()
  @IsNotEmpty()
  public credDefId: string;

  @IsString()
  public schemaId?: string;

  @IsString()
  @IsNotEmpty()
  public participantId?: string;

  @IsString()
  @IsNotEmpty()
  public principalDid?: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsString()
  @IsNotEmpty()
  public threadId: string;

  @IsString()
  @IsNotEmpty()
  public connectionId: string;

  @IsString()
  public expirationDate?: Date | null;
}
