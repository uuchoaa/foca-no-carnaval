module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  collectCoverageFrom: [
    'readers/**/*.js',
    '!**/*.test.js',
    '!**/*.spec.js'
  ],
  verbose: true
};
