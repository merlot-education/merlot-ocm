import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import GetProofRequest from './get-proof-request.dto.js';

export default class SendProofRequestBody {
  @ApiProperty({ example: 'comments' })
  public comment?: string;

  @IsString()
  public status?: string;

  @ApiProperty({ example: 'WgWxqztrNooG92RXvxSTWv:3:CL:20:tag' })
  @IsString()
  public schemaId: string;

  @IsString()
  public theirDID?: string;

  @IsString()
  public presentationMessage?: string;

  @ApiProperty({
    example: {
      type: 'Aries1.0',
      credentialDefinitionId: 'credentialDefinitionId',
    },
  })
  public options?: {
    type: string;
    credentialDefinitionId: string;
  };

  @IsString()
  public invitation?: GetProofRequest;

  @ApiProperty({ example: ['attributeName'] })
  public attributes: [
    {
      attributeName: string;
      schemaId: string;
      credentialDefId: string;
      value: string;
      condition: string;
    },
  ];
}
