import type { TestingModule } from '@nestjs/testing';

import { Test } from '@nestjs/testing';
import {
  EventAnonCredsSchemasGetAll,
  EventAnonCredsSchemasGetById,
  EventAnonCredsSchemasRegister,
} from '@ocm/shared';
import { Subject, of, takeUntil } from 'rxjs';

import { NATS_CLIENT } from '../../common/constants.js';
import { SchemasService } from '../schemas.service.js';

describe('SchemasService', () => {
  let service: SchemasService;
  const natsClientMock = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: NATS_CLIENT, useValue: natsClientMock },
        SchemasService,
      ],
    }).compile();

    service = module.get<SchemasService>(SchemasService);

    jest.resetAllMocks();
  });

  describe('getAll', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const payload = {
        tenantId: 'mocked tenantId',
        endpoint: EventAnonCredsSchemasGetAll.token,
      };
      const expectedResult: EventAnonCredsSchemasGetAll['data'] = [];

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsSchemasGetAll([], payload.tenantId)),
      );

      service
        .getAll(payload)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            { endpoint: EventAnonCredsSchemasGetAll.token },
            payload,
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('getById', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const payload = {
        tenantId: 'mocked tenantId',
        schemaId: 'mocked id',
      };
      const expectedResult: EventAnonCredsSchemasGetById['data'] = {
        issuerId: 'mocked issuerDid',
        name: 'mocked name',
        version: '1.0.0',
        attrNames: ['mocked attribute1', 'mocked attribute2'],
      };

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsSchemasGetById(expectedResult, payload.tenantId)),
      );

      service
        .getById(payload)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            { endpoint: EventAnonCredsSchemasGetById.token },
            payload,
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });

  describe('register', () => {
    it('should return the data from NATS client', (done) => {
      const unsubscribe$ = new Subject<void>();
      const payload = {
        tenantId: 'mocked tenantId',
        issuerDid: 'mocked issuerDid',
        name: 'mocked name',
        version: '1.0.0',
        attributeNames: ['mocked attribute1', 'mocked attribute2'],
      };
      const expectedResult: EventAnonCredsSchemasRegister['data'] = {
        issuerId: 'mocked issuerDid',
        name: 'mocked name',
        version: '1.0.0',
        attrNames: ['mocked attribute1', 'mocked attribute2'],
      };

      natsClientMock.send.mockReturnValueOnce(
        of(new EventAnonCredsSchemasRegister(expectedResult, payload.tenantId)),
      );

      service
        .register(payload)
        .pipe(takeUntil(unsubscribe$))
        .subscribe((result) => {
          expect(natsClientMock.send).toHaveBeenCalledWith(
            { endpoint: EventAnonCredsSchemasRegister.token },
            payload,
          );

          expect(result).toStrictEqual(expectedResult);

          unsubscribe$.next();
          unsubscribe$.complete();

          done();
        });
    });
  });
});
