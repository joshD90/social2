import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "./GeneralQueryGenerator";

export const connectionMock = jest.fn(() => ({
  execute: mockExecute,
  query: mockQuery,
}));

const mockExecute = jest.fn();
const mockQuery = jest.fn();

describe("General Query Generator Test Suite", () => {
  const sut = new GeneralQueryGenerator(
    "table1",
    connectionMock as any as Pool
  );

  it("should return the table name for the name getter", () => {
    const actual = sut.getTableName();
    expect(actual).toBe("table1");
  });
});
