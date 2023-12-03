import config from '../jest.config.js';

/** @type {import('jest').Config} */
export default {
  ...config,
  testTimeout: 24000,
  rootDir: '.',
  testRegex: '.*\\.e2e-spec\\.ts$',
};
