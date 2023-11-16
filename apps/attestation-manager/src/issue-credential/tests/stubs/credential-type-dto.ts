import schemaDto from '../../../schemas/tests/stubs/schema-dto.js';
import CredentialTypeDto from '../../entities/credentialType.entity.js';

const credentialsTypeDto = (): CredentialTypeDto => ({
  id: 'credential-type-id',
  schemaId: schemaDto().schemaID,
  type: 'type',
});

export default credentialsTypeDto;
