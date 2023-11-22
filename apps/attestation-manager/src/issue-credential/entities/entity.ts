import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

class CredentialPreviewAttributes {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @ApiProperty()
  public value: string;
}
export default class OfferCredentialDto {
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

  @ApiProperty({ type: [CredentialPreviewAttributes] })
  public attributes: CredentialPreviewAttributes[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public autoAcceptCredential: string;
}
