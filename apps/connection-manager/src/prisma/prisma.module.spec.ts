import PrismaModule from './prisma.module.js';

describe('Check if the module is working', () => {
  it('should be defined', () => {
    expect(PrismaModule).toBeDefined();
  });
});
