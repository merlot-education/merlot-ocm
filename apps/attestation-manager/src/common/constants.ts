export enum LoggerConfig {
  FILE_PATH = 'logs/log.json',
  LOG_DIR = './logs',
}

export enum Connection {
  BASE_URL = 'http://3.111.77.38:3003', // TODO Hardcoded IP, move to env variables
  CONNECTION = 'v1/connections',
  GET_CONNECTION_BY_ID = 'getConnectionById',
  NATS_ENDPOINT = 'CONNECTION_MANAGER_SERVICE',
  MAKE_CONNECTION_TRUSTED = 'makeConnectionTrusted',
  GET_RECEIVED_CONNECTIONS = 'getReceivedConnections',
}

export enum Abstraction {
  NATS_ENDPOINT = 'SSI_ABSTRACTION_SERVICE',
  CREDENTIAL_STATE_CHANGED = 'CredentialStateChanged',
}

export enum NATSServices {
  SERVICE_NAME = 'ATTESTATION_MANAGER_SERVICE',
}

export enum TSAService {
  PRINCIPAL_CREDENTIAL_REQUEST = 'PrincipalCredentialRequest',
}

export enum PrismaErrorCode {
  RECORD_NOT_FOUND = 'P2025',
}

export const VersionRegex = /^(\d+\.)(\d+\.)?(\d+)$/;

export enum AutoAcceptCredential {
  ALWAYS = 'always',
  Content_Approved = 'contentApproved',
  NEVER = 'never',
}
