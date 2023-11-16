import { IsBooleanString, IsNotEmpty, IsString } from 'class-validator';

import InvitationDTO from './InvitationDto.entity.js';

export default class ConnectionStateDto {
  @IsString()
  _tags?: string;

  @IsString()
  metadata?: string;

  @IsString()
  didDoc?: string;

  @IsString()
  verkey?: string;

  @IsString()
  createdAt?: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  did: string;

  @IsString()
  theirDid: string;

  @IsString()
  theirLabel: string;

  @IsString()
  invitation: InvitationDTO;

  @IsString()
  alias: string;

  @IsBooleanString()
  multiUseInvitation?: boolean;
}
