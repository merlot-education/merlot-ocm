import type CredentialStateDto from '../../entities/credential.state.entity.js';

import credDefStub from '../../../credentialDef/tests/stubs/credDef.stub.js';

import credentialDto from './credential-dto.js';

const credentialStateDto = (): CredentialStateDto => ({
  id: 'credential-state-id',
  metadata: {
    '_internal/indyCredential': {
      credentialDefinitionId: credentialDto().credDefId,
      schemaId: credDefStub().schemaID,
    },
  },
  credDefId: credentialDto().credDefId,
  state: credentialDto().state,
  threadId: 'thread-id',
  connectionId: credentialDto().connectionId,
});

export default credentialStateDto;
