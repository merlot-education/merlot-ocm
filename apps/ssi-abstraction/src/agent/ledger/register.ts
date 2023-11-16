import logger from '../../globalUtils/logger.js';
import axios from 'axios';
import { logAxiosError } from '../utils/helperFunctions.js';
import { LedgerIds, ledgerNamespaces, NYM_URL } from '../utils/ledgerConfig.js';

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
  // eslint-disable-next-line no-restricted-syntax
  for (const ledgerId of ledgerIds) {
    try {
      // TODO: why does this fail?
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const ledgerRegisterUrl = NYM_URL[ledgerId];
      const ledgerNamespace = ledgerNamespaces[ledgerId];

      const body: LedgerRegistrationBody = {
        role: 'ENDORSER',
        alias,
        seed,
      };

      // eslint-disable-next-line no-await-in-loop
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
      logAxiosError(err);
    }
  }
  return responses;
};

export default registerPublicDids;
