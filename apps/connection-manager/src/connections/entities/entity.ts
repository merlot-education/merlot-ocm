import { IsString, IsNotEmpty, IsDate, IsBoolean } from 'class-validator';

import InvitationDTO from './InvitationDto.entity.js';

export default class ConnectionDto {
  @IsString()
  public id?: string;

  @IsDate()
  public connectionDate?: Date;

  @IsDate()
  public createdDate?: Date;

  @IsDate()
  public updatedDate?: Date;

  @IsString()
  @IsNotEmpty()
  public participantDid: string;

  @IsString()
  @IsNotEmpty()
  public status: string;

  @IsString()
  @IsNotEmpty()
  public connectionId: string;

  @IsString()
  public theirDid: string;

  @IsString()
  public theirLabel: string;

  @IsBoolean()
  public isReceived: boolean;

  @IsString()
  public invitation?: InvitationDTO;
}
