import credDefStub from '../stubs/credDef.stub.js';

const CredentialDefServiceMock = jest.fn().mockReturnValue({
  createCredDef: jest.fn().mockReturnValue(credDefStub()),
  findCredentialDef: jest.fn().mockReturnValue([1, [credDefStub()]]),
  findCredentialDefById: jest.fn().mockReturnValue([1, [credDefStub()]]),
  findCredentialDefBySchemaIdDesc: jest
    .fn()
    .mockReturnValue([1, [credDefStub()]]),
  checkCredDefByNameAndSchemaID: jest
    .fn()
    .mockImplementation((cd) =>
      cd.id === credDefStub().id ? [0, []] : [1, [credDefStub()]],
    ),
  getAgentByParticipantId: jest.fn().mockReturnValue([1, [credDefStub()]]),
  createCredDefOnLedger: jest.fn().mockReturnValue({ id: 'new-creddef-id' }),
});

export default CredentialDefServiceMock;
