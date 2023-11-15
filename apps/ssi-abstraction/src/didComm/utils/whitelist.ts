import GenericBody from '@didComm/entities/GenericBody';
// import { SuccessResponse } from 'nats/lib/nats-base-client/types';

export interface CheckType {
  success: boolean;
  messages: string[];
}

export interface GenericParams {
  property: // | 'connections'
  // 'proofs'
  // | 'basicMessages'
  // | 'ledger'
  // | 'credentials'
  // | 'mediationRecipient'
  // | 'mediator'
  // | 'discovery'
  'wallet';

  method: // | 'createConnection'
  // | 'receiveInvitation'
  // | 'receiveInvitationFromUrl'
  // | 'acceptInvitation'
  // | 'acceptRequest'
  // | 'acceptResponse'
  // | 'returnWhenIsConnected'
  // | 'getAll'
  // | 'getById'
  // | 'findById'
  // | 'deleteById'
  // | 'findByVerkey'
  // | 'findByTheirKey'
  // | 'findByInvitationKey'
  // | 'getByThreadId'
  // | 'proposeProof'
  // | 'acceptProposal'
  // | 'requestProof'
  // | 'createOutOfBandRequest'
  // | 'acceptRequest'
  | 'declineRequest'
  // | 'acceptPresentation'
  // | 'getRequestedCredentialsForProofRequest'
  // | 'autoSelectCredentialsForProofRequest'
  // | 'sendProblemReport'
  // | 'sendMessage'
  // | 'findAllByQuery'
  // | 'registerPublicDid'
  // | 'getPublicDid'
  // | 'registerSchema'
  // | 'getSchema'
  // | 'registerCredentialDefinition'
  // | 'getCredentialDefinition'
  // | 'proposeCredential'
  // | 'acceptProposal'
  // | 'negotiateProposal'
  // | 'offerCredential'
  // | 'createOutOfBandOffer'
  // | 'acceptOffer'
  // | 'declineOffer'
  // | 'negotiateOffer'
  // | 'acceptCredential'
  // | 'initiateMessagePickup'
  // | 'pickupMessages'
  // | 'setDefaultMediator'
  // | 'notifyKeylistUpdate'
  // | 'findDefaultMediatorConnection'
  // | 'discoverMediation'
  // | 'requestMediation'
  // | 'findByConnectionId'
  // | 'getMediators'
  // | 'findDefaultMediator'
  // | 'requestAndAwaitGrant'
  // | 'provision'
  // | 'queueMessage'
  // | 'grantRequestedMediation'
  // | 'queryFeatures'
  // | 'initialize'
  // | 'create'
  // | 'open'
  // | 'close'
  // | 'delete'
  // | 'initPublicDid'
  // | 'createDid'
  // | 'pack'
  // | 'unpack'
  | 'sign'
  | 'verify';
  // | 'generateNonce';
}

export const propertiesList = [
  // 'connections',
  'proofs',
  // 'basicMessages',
  // 'ledger',
  // 'credentials',
  // 'mediationRecipient',
  // 'mediator',
  // 'discovery',
  'wallet',
];

export const methodsList = [
  // 'createConnection',
  // 'receiveInvitation',
  // 'receiveInvitationFromUrl',
  // 'acceptInvitation',
  // 'acceptRequest',
  // 'acceptResponse',
  // 'returnWhenIsConnected',
  // 'getAll',
  // 'getById',
  // 'findById',
  // 'deleteById',
  // 'findByVerkey',
  // 'findByTheirKey',
  // 'findByInvitationKey',
  // 'getByThreadId',
  // 'proposeProof',
  // 'acceptProposal',
  // 'requestProof',
  // 'createOutOfBandRequest',
  // 'acceptRequest',
  'declineRequest',
  // 'acceptPresentation',
  // 'getRequestedCredentialsForProofRequest',
  // 'autoSelectCredentialsForProofRequest',
  // 'sendProblemReport',
  // 'sendMessage',
  // 'findAllByQuery',
  // 'registerPublicDid',
  // 'getPublicDid',
  // 'registerSchema',
  // 'getSchema',
  // 'registerCredentialDefinition',
  // 'getCredentialDefinition',
  // 'proposeCredential',
  // 'acceptProposal',
  // 'negotiateProposal',
  // 'offerCredential',
  // 'createOutOfBandOffer',
  // 'acceptOffer',
  // 'declineOffer',
  // 'negotiateOffer',
  // 'acceptCredential',
  // 'initiateMessagePickup',
  // 'pickupMessages',
  // 'setDefaultMediator',
  // 'notifyKeylistUpdate',
  // 'findDefaultMediatorConnection',
  // 'discoverMediation',
  // 'requestMediation',
  // 'findByConnectionId',
  // 'getMediators',
  // 'findDefaultMediator',
  // 'requestAndAwaitGrant',
  // 'provision',
  // 'queueMessage',
  // 'grantRequestedMediation',
  // 'queryFeatures',
  // 'initialize',
  // 'create',
  // 'open',
  // 'close',
  // 'delete',
  // 'initPublicDid',
  // 'createDid',
  // 'pack',
  // 'unpack',
  'sign',
  'verify',
  // 'generateNonce',
];

export const subMethodsList = [
  'invitation',
  'invitation.toUrl',
  'invitation.fromUrl',
  'getTags',
  'myKey',
  'theirKey',
  'isReady',
  'assertReady',
  'assertState',
  'assertRole',
  'getCredentialInfo',
  'assertConnection',
  // REVIEW:
  // maybe we could allow some generic methods?
  // i.e. 'toJSON', 'toString', etc.
];

/**
 *
 * Checks if the property, method or subMethod are allowed
 *
 * @param property - property of the agent
 * @param method - method of the property
 * @param body - arguments and subMethod name + arguments
 * @returns {CheckType} -an object with the conditional message
 */
export const checkAll = (
  property: string,
  method: string,
  body: GenericBody,
): CheckType => {
  const messages: string[] = [];
  let success = true;

  if (property && propertiesList.indexOf(property) <= -1) {
    success = false;
    messages.push(`"${property}" either does not exist or is not allowed.`);
  }

  if (method && methodsList.indexOf(method) <= -1) {
    success = false;
    messages.push(`"${method}" either does not exist or is not allowed.`);
  }

  if (
    body.subMethod
    && body.subMethod.name
    && subMethodsList.indexOf(body.subMethod.name) <= -1
  ) {
    success = false;
    messages.push('"subMethod name" either does not exist or is not allowed.');
  }

  return {
    success,
    messages,
  };
};

export default {
  propertiesList,
  methodsList,
  subMethodsList,
  checkAll,
};
