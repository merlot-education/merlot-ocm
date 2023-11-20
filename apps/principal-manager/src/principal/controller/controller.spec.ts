import { HttpStatus } from '@nestjs/common';
import NatsClientService from '../../client/nats.client.js';
import PrincipalService from '../services/service.js';
import PrincipalController from './controller.js';

const STUB_CONNECTION_COMPLETE = {
  status: 'complete',
  connectionId: 'connectionId',
  theirLabel: 'theirLabel',
  participantId: 'participantId',
  participantDID: 'participantDID',
  theirDid: 'theirDid',
};

const STUB_CONNECTION_COMPLETE_2 = {
  status: 'incomplete',
  connectionId: 'connectionId',
  theirLabel: 'theirLabel',
  participantId: 'participantId',
  participantDID: 'participantDID',
  theirDid: 'theirDid',
};

describe.skip('Check if the controller is working', () => {
  let principalService: PrincipalService;
  let principalController: PrincipalController;
  let natsClientService: NatsClientService;

  beforeEach(async () => {
    principalService = new PrincipalService(natsClientService);
    principalController = new PrincipalController(principalService);
  });

  it('should be defined', () => {
    expect(PrincipalController).toBeDefined();
  });

  it('should throw a bad request if status is not complete', async () => {
    const response = await principalController.connectionComplete(
      STUB_CONNECTION_COMPLETE_2,
    );
    expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(response.message).toBe('Connection status should be Complete');
    expect(response.data).toBeUndefined();
    expect(response.error).toBeUndefined();
  });

  it('should return a success response if status is complete', async () => {
    jest
      .spyOn(principalService, 'OfferMembershipCredential')
      .mockResolvedValueOnce({
        statusCode: HttpStatus.OK,
        message: 'Status connection received',
      });
    const response = await principalController.connectionComplete(
      STUB_CONNECTION_COMPLETE,
    );
    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.message).toBe('Status connection received');
    expect(response.data).toBeUndefined();
    expect(response.error).toBeUndefined();
  });
});
