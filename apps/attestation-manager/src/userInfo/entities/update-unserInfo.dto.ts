type UserInfo = {
  [key: string]: unknown;
};

export default class UpdateUserInfoDto {
  connectionId: string;

  status: string;

  credentialDefinitionId: string;

  userInfo: UserInfo;
}
