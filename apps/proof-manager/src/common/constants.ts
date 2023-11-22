export enum LoggerConfig {
  FILE_PATH = 'logs/log.json',
  LOG_DIR = './logs',
}

export enum NATSServices {
  SERVICE_NAME = 'PROOF_MANAGER_SERVICE',
  PRESENTATION_SUBSCRIBER_ENDPOINT = 'PresentationSubscriberEndpoint',
}

export enum Abstraction {
  NATS_ENDPOINT = 'SSI_ABSTRACTION_SERVICE',
  PROOF_STATE_CHANGED = 'ProofStateChanged',
}

export enum Connection {
  GET_CONNECTION_By_ID = 'getConnectionById',
  NATS_ENDPOINT = 'CONNECTION_MANAGER_SERVICE',
  MAKE_CONNECTION_TRUSTED = 'makeConnectionTrusted',
}

export enum ATTESTATION {
  ATTESTATION_MANAGER_SERVICE = 'ATTESTATION_MANAGER_SERVICE',
  GET_MEMBERSHIP_CREDENTIALS_DETAILS = 'getCredentialsTypeDetails',
  CREDENTIAL_TYPE = 'principalMemberCredential',
}

export enum States {
  RequestSent = 'request-sent',
  PresentationReceived = 'presentation-received',
  Done = 'done',
}
