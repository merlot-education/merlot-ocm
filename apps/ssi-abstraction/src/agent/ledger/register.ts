import type { LedgerIds } from '../utils/ledgerConfig.js';

import axios from 'axios';

import { logger } from '../../globalUtils/logger.js';
import { logAxiosError } from '../utils/helperFunctions.js';
import { ledgerNamespaces, NYM_URL } from '../utils/ledgerConfig.js';

type RegisterPublicDidOptions = {
  alias: string;
  ledgerIds: Array<LedgerIds>;
  seed: string;
};

type LedgerRegistrationBody = {
  role?: 'ENDORSER';
  alias?: string;
  seed: string;
};

type RegisterPublicDidResponse = {
  seed: string;
  did: string;
  verkey: string;
};

export const registerPublicDids = async ({
  ledgerIds,
  alias,
  seed,
}: RegisterPublicDidOptions): Promise<Array<RegisterPublicDidResponse>> => {
  const responses: Array<RegisterPublicDidResponse> = [];
  for (const ledgerId of ledgerIds) {
    try {
      const ledgerRegisterUrl = NYM_URL[ledgerId];
      const ledgerNamespace = ledgerNamespaces[ledgerId];

      const body: LedgerRegistrationBody = {
        role: 'ENDORSER',
        alias,
        seed,
      };

      const res = await new axios.Axios().post<RegisterPublicDidResponse>(
        ledgerRegisterUrl,
        body,
      );

      if (res.data) {
        logger.info('Agent DID registered.');
        res.data.did = `did:indy:${ledgerNamespace}:${res.data.did}`;
        responses.push(res.data);
      } else {
        throw new Error('No data was returned from the ledger request');
      }
    } catch (err) {
      // if did is already registered on IdUnion it will catch 500, but it's ok
      if (err instanceof axios.AxiosError) logAxiosError(err);
    }
  }
  return responses;
};
