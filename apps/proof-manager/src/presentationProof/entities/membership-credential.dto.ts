import { IsString } from 'class-validator';

export default class MembershipCredentialDto {
  @IsString()
  public connectionId: string;

  public attributes: {
    attributeName: string;
    schemaId?: string;
    credentialDefId?: string;
  }[];
}
