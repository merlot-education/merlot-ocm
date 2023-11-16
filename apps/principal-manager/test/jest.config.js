/** @type {import('jest').Config} */

import config from '../jest.config.js';

export default {
  ...config,
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
};
