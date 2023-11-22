import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class SchemaDto {
  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public schemaID: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public name: string;

  @IsString()
  @ApiProperty()
  public createdBy: string;

  @IsString()
  public createdDate: Date;

  @IsString()
  public updatedBy?: string;

  @IsString()
  public updatedDate: Date;

  @IsString()
  @ApiProperty()
  public version: string;

  @IsString()
  @ApiProperty()
  public attributes: string[];

  @IsString()
  public pageSize?: string;

  @IsString()
  public page?: string;

  @IsString()
  @ApiPropertyOptional()
  public type?: string;
}
