import credDefStub from '../../../credentialDef/tests/stubs/credDef.stub.js';
import CredentialDto from '../../entities/credential.entity.js';
import AttestationService from '../../services/service.js';

const credentialDto = (): CredentialDto => ({
  credentialId: 'credential-id',
  credDefId: credDefStub().id,
  principalDid: 'principal-did',
  threadId: 'thread-id',
  state: AttestationService.status.OFFER_SENT,
  connectionId: 'connection-id',
});

export default credentialDto;
