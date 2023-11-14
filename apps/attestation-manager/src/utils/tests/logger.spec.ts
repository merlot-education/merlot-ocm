import fs from 'fs';

describe('Logger', () => {
  let logger: unknown;

  jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
  jest.spyOn(fs, 'mkdirSync').mockImplementation(() => 'mocked');

  beforeEach(async () => {
    logger = await import('../logger.js');
  });

  it('should call logger', async () => {
    expect(logger).toBeDefined();
  });

  it('should check if directory exists', async () => {
    expect(fs.existsSync).toHaveBeenCalled();
  });

  it('should create a directory if not exists', async () => {
    expect(fs.mkdirSync).toHaveBeenCalled();
  });
});

// import pagination from '../pagination';

// describe('Pagination', () => {
//   let pageSize: number;
//   let page: number;

//   it('should return skip 0 and take 10', async () => {
//     pageSize = 0;
//     page = 0;

//     const res = pagination(pageSize, page);

//     expect(res).toEqual({
//       skip: 0,
//       take: 10,
//     });
//   });

//   it('should return skip (page * pageSize) and take (pageSize)', async () => {
//     pageSize = 5;
//     page = 0;

//     const res = pagination(pageSize, page);

//     expect(res).toEqual({
//       skip: page * pageSize,
//       take: pageSize,
//     });
//   });
// });
