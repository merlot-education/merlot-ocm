import { IsBooleanString, IsNotEmpty, IsString } from 'class-validator';

import InvitationDTO from './InvitationDto.entity.js';

export default class ConnectionStateDto {
  @IsString()
  public _tags?: string;

  @IsString()
  public metadata?: string;

  @IsString()
  public didDoc?: string;

  @IsString()
  public verkey?: string;

  @IsString()
  public createdAt?: string;

  @IsString()
  @IsNotEmpty()
  public role: string;

  @IsString()
  @IsNotEmpty()
  public state: string;

  @IsString()
  @IsNotEmpty()
  public id: string;

  @IsString()
  @IsNotEmpty()
  public did: string;

  @IsString()
  public theirDid: string;

  @IsString()
  public theirLabel: string;

  @IsString()
  public invitation: InvitationDTO;

  @IsString()
  public alias: string;

  @IsBooleanString()
  public multiUseInvitation?: boolean;
}
