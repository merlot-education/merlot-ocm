import { IsDateString, IsNumber, IsString } from 'class-validator';

export default class FindProofPresentationDto {
  @IsNumber()
  public page: string;

  @IsNumber()
  public pageSize: string;

  @IsString()
  public proofRecordId: string;

  @IsString()
  public connectionId: string;

  @IsString()
  public credentialDefId: string;

  @IsString()
  public schemaId: string;

  @IsString()
  public theirDid: string;

  @IsString()
  public status: string;

  @IsDateString()
  public createdDateStart: string;

  @IsDateString()
  public createdDateEnd: string;

  @IsDateString()
  public updatedDateStart: string;

  @IsDateString()
  public updatedDateEnd: string;
}
