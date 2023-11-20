import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export default class CredentialTypeDto {
  @IsString()
  public id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public schemaId: string;
}
