import type CredentialTypeDto from '../../entities/credentialType.entity.js';

import schemaDto from '../../../schemas/tests/stubs/schema-dto.js';

const credentialsTypeDto = (): CredentialTypeDto => ({
  id: 'credential-type-id',
  schemaId: schemaDto().schemaID,
  type: 'type',
});

export default credentialsTypeDto;
