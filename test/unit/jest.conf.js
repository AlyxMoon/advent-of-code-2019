const { resolve } = require('path')

module.exports = {
  rootDir: resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json',
  ],
  moduleNameMapper: {
    '^@lib/(.*)$': '<rootDir>/lib/$1',
    '^@scripts/(.*)$': '<rootDir>/scripts/$1',
  },
  transform: {
    '^.+\\.js?$': 'babel-jest',
  },
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    '<rootDir>/lib/*.{js}',
    '<rootDir>/scripts/*.{js}',
    '!**/node_modules/**',
  ],
}
