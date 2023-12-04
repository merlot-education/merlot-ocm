import type { BaseEventInput } from './baseEvents.js';
import type { AnonCredsCredentialDefinition } from '@aries-framework/anoncreds';

import { BaseEvent } from './baseEvents.js';

export type CredentialDefinitionWithId = AnonCredsCredentialDefinition & {
  credentialDefinitionId: string;
};

export type EventAnonCredsCredentialDefinitionsGetAllInput = BaseEventInput;
export class EventAnonCredsCredentialDefinitionsGetAll extends BaseEvent<
  Array<CredentialDefinitionWithId>
> {
  public static token = 'anoncreds.credentialDefinitions.getAll';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsCredentialDefinitionsGetAll) {
    return new EventAnonCredsCredentialDefinitionsGetAll(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialDefinitionsGetByIdInput = BaseEventInput<{
  credentialDefinitionId: string;
}>;
export class EventAnonCredsCredentialDefinitionsGetById extends BaseEvent<CredentialDefinitionWithId | null> {
  public static token = 'anoncreds.credentialDefinitions.getById';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsCredentialDefinitionsGetById) {
    return new EventAnonCredsCredentialDefinitionsGetById(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}

export type EventAnonCredsCredentialDefinitionsRegisterInput = BaseEventInput<{
  schemaId: string;
  tag: string;
  issuerDid: string;
}>;

export class EventAnonCredsCredentialDefinitionsRegister extends BaseEvent<CredentialDefinitionWithId> {
  public static token = 'anoncreds.credentialDefinitions.register';

  public get instance() {
    return this.data;
  }

  public static fromEvent(e: EventAnonCredsCredentialDefinitionsRegister) {
    return new EventAnonCredsCredentialDefinitionsRegister(
      e.data,
      e.tenantId,
      e.id,
      e.type,
      e.timestamp,
    );
  }
}
