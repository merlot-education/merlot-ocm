import { HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import NatsClientService from '../../client/nats.client.js';
import PrincipalService from './service.js';

describe.skip('Check if the service is working', () => {
  let principalService: PrincipalService;
  let natsClient: NatsClientService;
  let client: ClientProxy;

  beforeEach(() => {
    natsClient = new NatsClientService(client);
    principalService = new PrincipalService(natsClient);
  });

  it('should be defined', () => {
    expect(PrincipalService).toBeDefined();
  });

  it('should respond correctly', async () => {
    jest.spyOn(natsClient, 'OfferMembershipCredential').mockResolvedValueOnce({
      statusCode: HttpStatus.OK,
      message: 'Status connection received',
    });
    const response = await principalService.OfferMembershipCredential({
      status: 'complete',
      connectionId: 'connectionId',
      theirLabel: 'theirLabel',
      participantId: 'participantId',
      participantDID: 'participantDID',
    });
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.message).toBe('Status connection received');
    expect(response.data).toBeUndefined();
    expect(response.error).toBeUndefined();
  });
});
