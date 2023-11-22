import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class AcceptPresentationDto {
  @IsString()
  @ApiProperty()
  public proofRecordId: string;
}
