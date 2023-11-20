import type { ResponseType } from '../../../common/response.js';

import AttestationService from '../../../issue-credential/services/service.js';

const natsAgentResponse: ResponseType = {
  statusCode: 200,
  data: {
    service_endpoint: 'TEST_AGENT_URL',
  },
  message: 'Agent Details',
};

const natsConnectionResponse = {
  status: AttestationService.connectionStatus.TRUSTED,
};

export { natsAgentResponse, natsConnectionResponse };
