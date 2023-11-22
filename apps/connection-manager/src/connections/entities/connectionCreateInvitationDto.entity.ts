import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class ConnectionCreateInvitationDto {
  @IsString()
  @ApiProperty()
  public autoAcceptConnection?: boolean;

  @IsString()
  @ApiProperty()
  public alias?: string;

  @IsString()
  @ApiProperty()
  public myLabel?: string;

  @IsString()
  @ApiProperty()
  public myImageUrl?: string;
}
