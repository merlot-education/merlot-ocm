import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import NatsClientService from '../../client/nats.client.js';
import {
  AttestationManagerUrl,
  ConnectionManagerUrl,
  CreateMemberConnection,
  SaveUserInfo,
} from '../../common/constants.js';
import ResponseType from '../../common/response.js';
import MapUserInfoDTO from '../entities/mapUserInfoDTO.entity.js';
import OfferMembershipCredentialDto from '../entities/offerMembershipCredentialDto.entity.js';

@Injectable()
export default class PrincipalService {
  constructor(
    private readonly natsClient: NatsClientService,
    private readonly httpService: HttpService,
  ) {}

  async OfferMembershipCredential(data: OfferMembershipCredentialDto) {
    const response: ResponseType = {
      statusCode: HttpStatus.OK,
      message: 'Status connection received',
    };
    this.natsClient.OfferMembershipCredential(data);
    return response;
  }

  async mapUserInfo({
    userData,
    userInfoURL,
  }: MapUserInfoDTO): Promise<unknown> {
    try {
      let userInfo;

      if (userData) {
        userInfo = userData;
      }

      if (!userInfo && userInfoURL) {
        const response = await this.httpService.axiosRef.get(userInfoURL, {
          headers: {
            // eslint is going to throw error - ignore it
            // Authorization: `${req.headers.get('Authorization')}`,
          },
        });
        userInfo = response.data;
      }

      const createConnectionBody = {
        autoAcceptConnection: true,
      };

      const userDetails = {
        connectionId: '',
        autoAcceptCredential: 'never',
        userInfo,
      };

      const { data: connection } = await this.httpService.axiosRef.post(
        `${ConnectionManagerUrl}/${CreateMemberConnection}`,
        createConnectionBody,
      );

      userDetails.connectionId = connection.data?.connection?.id;

      const { data: savedUserInfo } = await this.httpService.axiosRef.post(
        `${AttestationManagerUrl}/${SaveUserInfo}`,
        userDetails,
      );

      return {
        invitationUrl: connection.data.invitationUrl,
        userInfo: savedUserInfo.data,
      };
    } catch (error: unknown) {
      throw new HttpException(
        Reflect.get(error || {}, 'message') || 'Internal server error',
        Reflect.get(error || {}, 'status') || 500,
      );
    }
  }
}
