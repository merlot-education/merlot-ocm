import type SchemaDto from '../../entities/schema-entity.js';

const schemaDto = (): SchemaDto => ({
  id: 'schema-db-id',
  schemaID: 'schema-ledger-id',
  name: 'schema-name',
  createdBy: 'created-by',
  createdDate: new Date(2022),
  updatedBy: 'updated-by',
  updatedDate: new Date(2022),
  version: '0.0.1',
  attributes: ['attr1', 'attr2', 'attr3'],
  pageSize: '3',
  page: '3',
  type: 'testing',
});

export default schemaDto;
