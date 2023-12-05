import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TenantIdParam {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The tenant ID to use for the request',
    format: 'string',
  })
  public tenantId: string;
}
