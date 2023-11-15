import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import GetProofRequest from './get-proof-request.dto.js';

export default class SendProofRequestBody {
  @ApiProperty({ example: 'comments' })
  comment?: string;

  @IsString()
  status?: string;

  @ApiProperty({ example: 'WgWxqztrNooG92RXvxSTWv:3:CL:20:tag' })
  @IsString()
  schemaId: string;

  @IsString()
  theirDID?: string;

  @IsString()
  presentationMessage?: string;

  @ApiProperty({
    example: {
      type: 'Aries1.0',
      credentialDefinitionId: 'credentialDefinitionId',
    },
  })
  options?: {
    type: string;
    credentialDefinitionId: string;
  };

  @IsString()
  invitation?: GetProofRequest;

  @ApiProperty({ example: ['attributeName'] })
  attributes: [
    {
      attributeName: string;
      schemaId: string;
      credentialDefId: string;
      value: string;
      condition: string;
    },
  ];
}
