import CredentialDefDto from '../../entities/credentialDef-entity.js';

const credDefStub = (): CredentialDefDto =>
  ({
    id: 'cred-def-stub-id',
    schemaID: 'cred-def-stub-schema-id',
    name: 'cred-def-stub-name',
    credDefId: 'cred-def-stub-cred-def-id',
    supportRevocation: true,
    isRevokable: true,
    isAutoIssue: true,
    expiryHours: '48',
    createdBy: 'cred-def-stub-created-by-id',
    createdDate: new Date(2022),
    updatedBy: 'cred-def-stub-updated-by-id',
    updatedDate: new Date(2022),
    tag: 'cred-def-stub-tag',
  }) as CredentialDefDto;

export default credDefStub;
