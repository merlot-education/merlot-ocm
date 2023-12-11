import type {
  EventAnonCredsSchemasGetAllInput,
  EventAnonCredsSchemasGetByIdInput,
  EventAnonCredsSchemasRegisterInput,
} from '@ocm/shared';

import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';
import { map, type Observable } from 'rxjs';

import { NATS_CLIENT } from '../common/constants.js';

@Injectable()
export class SchemasService {
  public constructor(
    @Inject(NATS_CLIENT) private readonly natsClient: ClientProxy,
  ) {}

  public getAll(
    payload: EventAnonCredsSchemasGetAllInput,
  ): Observable<EventAnonCredsSchemasGetAll['data']> {
    const pattern = { endpoint: EventAnonCredsSchemasGetAll.token };

    return this.natsClient
      .send<EventAnonCredsSchemasGetAll, EventAnonCredsSchemasGetAllInput>(
        pattern,
        payload,
      )
      .pipe(map((result) => result.data));
  }

  public getById(
    payload: EventAnonCredsSchemasGetByIdInput,
  ): Observable<EventAnonCredsSchemasGetById['data']> {
    const pattern = { endpoint: EventAnonCredsSchemasGetById.token };

    return this.natsClient
      .send<EventAnonCredsSchemasGetById, EventAnonCredsSchemasGetByIdInput>(
        pattern,
        payload,
      )
      .pipe(map((result) => result.data));
  }

  public register(
    payload: EventAnonCredsSchemasRegisterInput,
  ): Observable<EventAnonCredsSchemasRegister['data']> {
    const pattern = { endpoint: EventAnonCredsSchemasRegister.token };

    return this.natsClient
      .send<EventAnonCredsSchemasRegister, EventAnonCredsSchemasRegisterInput>(
        pattern,
        payload,
      )
      .pipe(map((result) => result.data));
  }
}
