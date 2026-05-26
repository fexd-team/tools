module.exports = {
  verbose: true,
  testEnvironment: 'jsdom',
  maxWorkers: '50%',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/tests/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/.umi/**',
    '!src/index.ts',
  ],
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
        },
      },
    ],
  },
  setupFiles: ['<rootDir>/scripts/jest-setup.ts'],
  moduleNameMapper: {},
}
