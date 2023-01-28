/** @type {import('jest').Config} */
module.exports = {
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  rootDir: '.',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
