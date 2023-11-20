type UserInfo = {
  [key: string]: unknown;
};

export default class UpdateUserInfoDto {
  public connectionId: string;

  public status: string;

  public credentialDefinitionId: string;

  public userInfo: UserInfo;
}
