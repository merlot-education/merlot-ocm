import pagination from './pagination.js';

describe('Check if the module is working', () => {
  it('should be defined', () => {
    expect(pagination).toBeDefined();
  });

  it('should be return default value', () => {
    const result = { skip: 0, take: 1000 };
    expect(pagination(0, 0)).toStrictEqual(result);
  });

  it('should be return next page value', () => {
    const result = { skip: 0, take: 10 };
    expect(pagination(10, 0)).toStrictEqual(result);
  });
});
