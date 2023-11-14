import schemaDto from './schema-dto.js';

const schemaAgentDto = {
  ver: '1.0',
  id: schemaDto().schemaID,
  name: schemaDto().name,
  version: schemaDto().version,
  attrNames: [...schemaDto().attributes, 'expirationDate'],
  seqNo: 335519,
};

export default schemaAgentDto;
