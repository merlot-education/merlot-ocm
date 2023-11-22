import { IsString } from 'class-validator';

export default class InvitationDTO {
  @IsString()
  public serviceEndpoint?: string;

  @IsString()
  public ['@type']?: string;

  @IsString()
  public ['@id']?: string;

  @IsString()
  public label?: string;

  @IsString()
  public recipientKeys?: [string];

  @IsString()
  public routingKeys?: [];
}
