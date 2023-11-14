import schemaAgentDto from '../../../schemas/tests/stubs/schema-from-agent-dto.js';
import credentialDto from '../stubs/credential-dto.js';
import credentialTypeDto from '../stubs/credential-type-dto.js';

const AttestationServiceMock = jest.fn().mockReturnValue({
  createOfferCredential: jest.fn().mockReturnValue({}),
  acceptRequestCredential: jest.fn().mockReturnValue({}),
  findCredentialById: jest.fn().mockReturnValue(credentialDto()),
  createCredentialsType: jest.fn().mockReturnValue(credentialTypeDto()),
  getPrincipalMemberShipCredentials: jest
    .fn()
    .mockReturnValue(credentialTypeDto()),
  createCredential: jest.fn().mockReturnValue(credentialDto()),
  updateCredential: jest.fn().mockReturnValue(credentialDto()),
  issueMemberCredentials: jest.fn().mockReturnValue({}),
  getSchemaAndAttributesBySchemaIDFromLedger: jest
    .fn()
    .mockReturnValue(schemaAgentDto),
});

export default AttestationServiceMock;
