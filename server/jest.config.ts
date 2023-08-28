import type { Config } from "@jest/types";

const baseDir = "<rootDir>/src/controllers/serviceControllers";
const baseTestDir = "<rootDir>/src/controllers/serviceControllers";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [`${baseDir}/**/*.ts`],
  testMatch: [`${baseTestDir}/**/*.test.ts`],
};

export default config;
