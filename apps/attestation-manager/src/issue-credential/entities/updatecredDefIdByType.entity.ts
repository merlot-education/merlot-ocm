import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export default class UpdateSchemaIdByTypeDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public schemaId: string;
}
