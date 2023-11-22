import { IsString, IsNotEmpty } from 'class-validator';

export default class PresentationSubscriptionEndpointDto {
  @IsString()
  @IsNotEmpty()
  public proofRecordId: string;

  @IsString()
  @IsNotEmpty()
  public status: string;
}
