import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class CredentialPreviewAttributes {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @ApiProperty()
  value: string;
}
export default class OfferCredentialDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  connectionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  credentialDefinitionId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;

  @ApiProperty({ type: [CredentialPreviewAttributes] })
  attributes: CredentialPreviewAttributes[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  autoAcceptCredential: string;
}
