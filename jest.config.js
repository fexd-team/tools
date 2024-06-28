module.exports = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  maxWorkers: '80%',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: ['*/src/**/*.{ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/scripts/jest-setup.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,
    },
  },
  moduleNameMapper: {},
}
