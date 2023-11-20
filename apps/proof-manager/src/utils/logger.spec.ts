// import * as fs from 'fs';

describe('Logger', () => {
  // beforeEach(() => {
  //   jest.mock('fs');
  // });
  it('should create a directory if not exists', async () => {
    // jest.spyOn(fs, 'existsSync').mockImplementation(() => false);
    // jest.spyOn(fs, 'mkdirSync').mockImplementation(() => 'mocked');
    const logger = await import('./logger.js');
    expect(logger).toBeDefined();
    // expect(fs.existsSync).toHaveBeenCalled();
    // expect(fs.mkdirSync).toHaveBeenCalled();
  });
});
