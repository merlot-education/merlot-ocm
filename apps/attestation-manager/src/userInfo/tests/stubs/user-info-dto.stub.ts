import credentialDto from '../../../issue-credential/tests/stubs/credential-dto.js';
import offerCredentialDto from '../../../issue-credential/tests/stubs/offer-credential-dto.js';
import schemaDto from '../../../schemas/tests/stubs/schema-dto.js';
import UserInfoDto from '../../entities/userInfo.entity.js';

const userInfo = (): UserInfoDto => ({
  autoAcceptCredential: offerCredentialDto().autoAcceptCredential,
  connectionId: credentialDto().connectionId,
  userInfo: {
    ...schemaDto().attributes.map((attr: string | symbol | number) => ({
      [attr]: attr,
    })),
  },
});

export default userInfo;
