export enum NATSServices {
  SERVICE_NAME = 'CONNECTION_MANAGER_SERVICE',
  CONNECTION_SUBSCRIBER_ENDPOINT = 'ConnectionSubscriberEndpoint',
}

export enum LoggerConfig {
  FILE_PATH = 'logs/log.json',
  LOG_DIR = './logs',
}

export enum Abstraction {
  NATS_ENDPOINT = 'SSI_ABSTRACTION_SERVICE',
  CONNECTION_STATE_CHANGED = 'ConnectionStateChanged',
}

export enum Principal {
  NATS_ENDPOINT = 'PRINCIPAL_MANAGER_SERVICE',
  CONNECTION_COMPLETE_STATUS = 'connectionCompleteStatus',
}

export enum Attestation {
  NATS_ENDPOINT = 'ATTESTATION_MANAGER_SERVICE',
  GET_ISSUE_CREDENTIALS = 'getIssueCredentials',
}

export enum ProofManager {
  NATS_ENDPOINT = 'PROOF_MANAGER_SERVICE',
  GET_PRESENT_PROOFS = 'getPresentProofs',
  SEND_MEMBERSHIP_PROOF_REQUEST = 'sendMembershipProofRequest',
}

export const RECEIVED_CONNECTION_ALIAS = 'connection-received';
