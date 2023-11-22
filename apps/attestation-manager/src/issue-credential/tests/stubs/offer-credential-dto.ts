import type OfferCredentialDto from '../../entities/entity.js';

import schemaDto from '../../../schemas/tests/stubs/schema-dto.js';

import credentialDto from './credential-dto.js';

const offerCredentialDto = (): OfferCredentialDto => ({
  connectionId: credentialDto().connectionId,
  credentialDefinitionId: credentialDto().credDefId,
  comment: 'Test Comment!!',
  attributes: schemaDto().attributes.map((attr: string) => ({
    name: attr,
    value: attr,
  })),
  autoAcceptCredential: 'never',
});

export default offerCredentialDto;
