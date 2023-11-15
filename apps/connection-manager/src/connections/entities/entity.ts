import { IsString, IsNotEmpty, IsDate, IsBoolean } from 'class-validator';

import InvitationDTO from './InvitationDto.entity.js';

export default class ConnectionDto {
  @IsString()
  id?: string;

  @IsDate()
  connectionDate?: Date;

  @IsDate()
  createdDate?: Date;

  @IsDate()
  updatedDate?: Date;

  @IsString()
  @IsNotEmpty()
  participantDid: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  connectionId: string;

  @IsString()
  theirDid: string;

  @IsString()
  theirLabel: string;

  @IsBoolean()
  isReceived: boolean;

  @IsString()
  invitation?: InvitationDTO;
}
