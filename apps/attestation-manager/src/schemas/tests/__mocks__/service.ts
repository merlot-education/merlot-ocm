import schemaDto from '../stubs/schema-dto.js';

const SchemasServiceMock = jest.fn().mockReturnValue({
  findSchemas: jest.fn().mockReturnValue([1, [schemaDto()]]),
  findSchemasById: jest.fn().mockReturnValue([1, [schemaDto()]]),
  findBySchemaId: jest.fn().mockReturnValue(schemaDto()),
  checkSchemasByNameAndVersion: jest.fn().mockReturnValue([0, []]),
  createSchemaOnLedger: jest.fn().mockReturnValue({ id: schemaDto().schemaID }),
  createSchemas: jest.fn().mockReturnValue(schemaDto()),
});

export default SchemasServiceMock;
