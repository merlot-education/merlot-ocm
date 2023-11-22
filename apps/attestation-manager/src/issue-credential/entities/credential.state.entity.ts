import { IsString, IsNotEmpty } from 'class-validator';

export default class CredentialStateDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsNotEmpty()
  public metadata: {
    '_internal/indyCredential': {
      credentialDefinitionId: string;
      schemaId: string;
    };
  };

  @IsString()
  @IsNotEmpty()
  public credDefId: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsString()
  @IsNotEmpty()
  public threadId: string;

  @IsString()
  @IsNotEmpty()
  public connectionId: string;
}
