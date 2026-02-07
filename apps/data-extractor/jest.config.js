module.exports = {
  testEnvironment: 'node',
  testMatch: [
    '**/sites/**/readers/**/*.test.js',
    '**/sites/**/interactions/**/*.test.js',
    '**/core/**/*.test.js',
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  collectCoverageFrom: [
    'core/**/*.js',
    'sites/**/readers/**/*.js',
    'sites/**/interactions/**/*.js',
    'sites/**/writers/**/*.js',
    '!**/*.test.js',
    '!**/*.spec.js'
  ],
  verbose: true
};
