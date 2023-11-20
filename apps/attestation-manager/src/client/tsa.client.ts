import { Injectable } from '@nestjs/common';

import RestClientService from './rest.client.js';

export interface PolicyReturnType {
  success: boolean;
  returnData?: unknown; // replace with actual structure when ready
}

export interface PolicyResult {
  allow: boolean;
  data?: unknown;
}

@Injectable()
export default class TSAClientService {
  public constructor(private readonly restClient: RestClientService) {}

  public async getPolicy(policyUrl: string) {
    try {
      const policyResponse: PolicyResult = await this.restClient.get(policyUrl);

      if (
        policyResponse &&
        policyResponse.allow &&
        typeof policyResponse.allow === 'boolean'
      ) {
        return {
          success: true,
          returnData: Boolean(policyResponse?.allow),
        } as PolicyReturnType;
      }

      // Add condition when policy returns data other than boolean
      return {
        success: false,
        returnData: 'Unable to fetch policy data.',
      } as PolicyReturnType;
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      let returnData = 'Something went wrong!';

      if (error?.isAxiosError) {
        returnData = `${error?.response?.status} ${error?.response?.statusText}`;
      }

      return {
        success: false,
        returnData,
      } as PolicyReturnType;
    }
  }
}
