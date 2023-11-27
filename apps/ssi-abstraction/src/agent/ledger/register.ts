import type { LedgerIds } from '../../config/ledger.js';

import { logger, logAxiosError } from '@ocm/shared';
import axios from 'axios';

import { LEDGERS } from '../../config/ledger.js';

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
      const ledgerRegisterUrl = LEDGERS[ledgerId].registerNymUrl;
      const ledgerNamespace = LEDGERS[ledgerId].namespace;

      const body: LedgerRegistrationBody = {
        role: 'ENDORSER',
        alias,
        seed,
      };

      const res = await axios({
        method: 'post',
        url: ledgerRegisterUrl,
        data: body,
      });

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
