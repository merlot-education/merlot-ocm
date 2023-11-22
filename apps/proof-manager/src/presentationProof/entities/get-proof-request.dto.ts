import { IsString } from 'class-validator';

export default class GetProofRequest {
  @IsString()
  public state: string;

  @IsString()
  public id: string;

  @IsString()
  public connectionId: string;

  public isVerified?: boolean;
}
