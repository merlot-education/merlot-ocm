import {
  BasicMessageEventTypes,
  ConnectionEventTypes,
  CredentialEventTypes,
  ProofEventTypes,
  RoutingEventTypes,
  TransportEventTypes,
} from '@aries-framework/core';

export const listenerConfig = [
  BasicMessageEventTypes.BasicMessageStateChanged,
  ConnectionEventTypes.ConnectionStateChanged,
  CredentialEventTypes.CredentialStateChanged,
  ProofEventTypes.ProofStateChanged,
  RoutingEventTypes.MediationStateChanged,
  RoutingEventTypes.RecipientKeylistUpdated,
  TransportEventTypes.OutboundWebSocketClosedEvent,
];

export default {
  listenerConfig,
};
