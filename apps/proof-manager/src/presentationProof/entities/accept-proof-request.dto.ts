import { IsString } from 'class-validator';

export default class AcceptProofRequestDto {
  @IsString()
  public proofRecordId: string;
}
