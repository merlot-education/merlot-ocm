import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import GetProofRequest from './get-proof-request.dto.js';

export default class SendProofRequest {
  @ApiProperty({ example: 'comments' })
  public comment?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  public connectionId?: string;

  @IsString()
  public proofRecordId?: string;

  @IsString()
  public status?: string;

  @IsString()
  public theirDID?: string;

  @IsString()
  public presentationMessage?: string;

  @IsString()
  public invitation?: GetProofRequest;

  @ApiProperty({
    example: [
      {
        attributeName: 'attributeName',
        schemaId: 'schemaId',
        credentialDefId: 'credentialDefId',
      },
    ],
  })
  public attributes: {
    attributeName: string;
    schemaId?: string;
    credentialDefId?: string;
    value: string;
    condition: string;
  }[];
}
