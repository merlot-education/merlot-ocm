import {
  natsAgentResponse,
  natsConnectionResponse,
} from '../stubs/nats-response.js';

const NatsClientServiceMock = jest.fn().mockReturnValue({
  getAgentByParticipantId: jest.fn().mockReturnValue(natsAgentResponse),
  getConnectionById: jest.fn().mockReturnValue(natsConnectionResponse),
});

export default NatsClientServiceMock;
