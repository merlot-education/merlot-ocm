import { IsString, IsNotEmpty } from 'class-validator';

export default class ConnectionSubscriptionEndpointDto {
  @IsString()
  @IsNotEmpty()
  public connectionId: string;

  @IsString()
  @IsNotEmpty()
  public status: string;
}
