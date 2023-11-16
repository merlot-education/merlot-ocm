import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

type UserInfo = {
  [key: string]: unknown;
};
export default class UserInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  connectionId: string;

  @IsEnum(['always', 'contentApproved', 'never'])
  @IsNotEmpty()
  @ApiProperty()
  autoAcceptCredential: string;

  @IsNotEmpty()
  @ApiProperty({ type: {} })
  userInfo: UserInfo;
}
