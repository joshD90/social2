import { Pool, PoolConnection } from "mysql2/promise";
import { createPool } from "mysql2";
import Database from "./Database";

const poolPromiseMock = {
  promise: jest.fn(() => ({ query: jest.fn() })),
};
//module returns a object directly rather than a constructor
jest.mock("mysql2", () => ({
  createPool: jest.fn(() => poolPromiseMock), // Attach the createPool mock here
}));

describe("Database class test suite", () => {
  let sut: Database;

  beforeEach(() => {
    sut = new Database();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should test that it creates a connection successfully", () => {
    const poolPromiseSpy = jest.spyOn(poolPromiseMock, "promise");

    expect(sut.getConnection()).toBeTruthy();
    expect(poolPromiseSpy).toHaveBeenCalled();
  });
});
