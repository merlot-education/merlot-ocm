import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class ProposeCredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public connectionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public credentialDefinitionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public comment: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public credentialProposal: {
    '@type': string;
    attributes: {
      name: string;
      value: string;
    }[];
  };

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public autoAcceptCredential: string;
}
