import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import GetProofRequest from './get-proof-request.dto.js';

export default class SendProofRequest {
  @ApiProperty({ example: 'comments' })
  comment?: string;

  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  connectionId?: string;

  @IsString()
  proofRecordId?: string;

  @IsString()
  status?: string;

  @IsString()
  theirDID?: string;

  @IsString()
  presentationMessage?: string;

  @IsString()
  invitation?: GetProofRequest;

  @ApiProperty({
    example: [
      {
        attributeName: 'attributeName',
        schemaId: 'schemaId',
        credentialDefId: 'credentialDefId',
      },
    ],
  })
  attributes: {
    attributeName: string;
    schemaId?: string;
    credentialDefId?: string;
    value: string;
    condition: string;
  }[];
}
