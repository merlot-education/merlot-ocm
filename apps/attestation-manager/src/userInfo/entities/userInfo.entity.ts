import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

type UserInfo = {
  [key: string]: unknown;
};
export default class UserInfoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  public connectionId: string;

  @IsEnum(['always', 'contentApproved', 'never'])
  @IsNotEmpty()
  @ApiProperty()
  public autoAcceptCredential: string;

  @IsNotEmpty()
  @ApiProperty({ type: {} })
  public userInfo: UserInfo;
}
