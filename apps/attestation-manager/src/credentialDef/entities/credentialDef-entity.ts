import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export default class CredentialDefDto {
  @IsString()
  public id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public schemaID: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  public credDefId: string;

  @IsBoolean()
  public supportRevocation?: boolean;

  @IsBoolean()
  @ApiProperty()
  public isRevokable: boolean;

  @IsBoolean()
  @ApiProperty()
  public isAutoIssue: boolean;

  @IsString()
  @ApiProperty()
  // Number of hours of Credential validity
  public expiryHours: string;

  @IsString()
  @ApiProperty()
  public createdBy: string;

  @IsString()
  public createdDate: Date;

  @IsString()
  public updatedBy: string;

  @IsString()
  public updatedDate: Date;

  @IsString()
  public tag?: string;

  @IsString()
  @ApiPropertyOptional()
  public type?: string;
}
