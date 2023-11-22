import pagination from '../pagination.js';

describe('Pagination', () => {
  let pageSize: number;
  let page: number;

  it('should return skip 0 and take 10', async () => {
    pageSize = 0;
    page = 0;

    const res = pagination(pageSize, page);

    expect(res).toEqual({
      skip: 0,
      take: 10,
    });
  });

  it('should return skip (page * pageSize) and take (pageSize)', async () => {
    pageSize = 5;
    page = 0;

    const res = pagination(pageSize, page);

    expect(res).toEqual({
      skip: page * pageSize,
      take: pageSize,
    });
  });
});
