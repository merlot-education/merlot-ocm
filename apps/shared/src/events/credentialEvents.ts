import type { BaseEventInput } from './baseEvents.js';

import {
  CredentialExchangeRecord,
  JsonTransformer,
} from '@aries-framework/core';

import { BaseEvent } from './baseEvents.js';

export type EventDidcommAnonCredsCredentialsGetAllInput = BaseEventInput;
export class EventDidcommAnonCredsCredentialsGetAll extends BaseEvent<
  Array<CredentialExchangeRecord>
> {
  public static token = 'didcomm.anoncreds.credentials.getAll';

  public get instance() {
    return this.data.map((d) =>
      JsonTransformer.fromJSON(d, CredentialExchangeRecord),
    );
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsGetAll) {
    return new EventDidcommAnonCredsCredentialsGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsGetByIdInput = BaseEventInput<{
  credentialRecordId: string;
}>;
export class EventDidcommAnonCredsCredentialsGetById extends BaseEvent<CredentialExchangeRecord | null> {
  public static token = 'didcomm.anoncreds.credentials.getById';

  public get instance() {
    return this.data
      ? JsonTransformer.fromJSON(this.data, CredentialExchangeRecord)
      : null;
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsGetById) {
    return new EventDidcommAnonCredsCredentialsGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsOfferInput = BaseEventInput<{
  connectionId: string;
  credentialDefinitionId: string;
  attributes: Array<{ name: string; value: string; mimeType?: string }>;
}>;
export class EventDidcommAnonCredsCredentialsOffer extends BaseEvent<CredentialExchangeRecord> {
  public static token = 'didcomm.anoncreds.credentials.offer';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, CredentialExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsOffer) {
    return new EventDidcommAnonCredsCredentialsOffer(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventDidcommAnonCredsCredentialsOfferToSelfInput = Omit<
  EventDidcommAnonCredsCredentialsOfferInput,
  'connectionId'
>;
export class EventDidcommAnonCredsCredentialsOfferToSelf extends BaseEvent<CredentialExchangeRecord> {
  public static token = 'didcomm.anoncreds.credentials.offerToSelf';

  public get instance() {
    return JsonTransformer.fromJSON(this.data, CredentialExchangeRecord);
  }

  public static fromEvent(e: EventDidcommAnonCredsCredentialsOfferToSelf) {
    return new EventDidcommAnonCredsCredentialsOfferToSelf(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
