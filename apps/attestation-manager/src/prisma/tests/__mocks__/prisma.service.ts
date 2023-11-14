import credDefStub from '../../../credentialDef/tests/stubs/credDef.stub.js';
import credentialDto from '../../../issue-credential/tests/stubs/credential-dto.js';
import credentialTypeDto from '../../../issue-credential/tests/stubs/credential-type-dto.js';
import schemaDto from '../../../schemas/tests/stubs/schema-dto.js';

const PrismaServiceMock = jest.fn().mockReturnValue({
  $transaction: jest.fn().mockImplementation((args: unknown[]) => [...args]),
  schema: {
    create: jest.fn().mockReturnValue([schemaDto()]),
    update: jest.fn().mockReturnValue([schemaDto()]),
    count: jest.fn().mockReturnValue(1),
    findMany: jest.fn().mockReturnValue([schemaDto()]),
  },
  credentialDef: {
    create: jest.fn().mockReturnValue([credDefStub()]),
    update: jest.fn().mockReturnValue([credDefStub()]),
    count: jest.fn().mockReturnValue(1),
    findMany: jest.fn().mockReturnValue([credDefStub()]),
    findFirst: jest.fn().mockReturnValue(credDefStub()),
  },
  credential: {
    create: jest.fn().mockReturnValue(credentialDto()),
    update: jest.fn().mockReturnValue(credentialDto()),
    findUnique: jest.fn().mockReturnValue(credentialDto()),
    count: jest.fn().mockReturnValue(1),
    findMany: jest.fn().mockReturnValue([credentialDto()]),
  },
  credentialsType: {
    update: jest.fn().mockReturnValue(credentialTypeDto()),
    create: jest.fn().mockReturnValue(credentialTypeDto()),
    findUnique: jest.fn().mockReturnValue(credentialTypeDto()),
    findFirst: jest.fn().mockReturnValue(credentialTypeDto()),
  },
});

export default PrismaServiceMock;
