import { Pool } from "mysql2/promise";
import { GeneralQueryGenerator } from "./GeneralQueryGenerator";

const mockExecute = jest.fn();
const mockQuery = jest.fn();
//as far as this is concerned connection is not a function, treat it like a stub
export const connectionMock = {
  execute: mockExecute,
  query: mockQuery,
};

describe("General Query Generator Test Suite", () => {
  const sut = new GeneralQueryGenerator(
    "table1",
    connectionMock as any as Pool
  );

  it("should return the table name for the name getter", () => {
    const actual = sut.getTableName();
    expect(actual).toBe("table1");
  });

  it("should return the first element of array for CreateTableEntryFromPrimitives if successful", async () => {
    const someData = { data1: "someData" };
    mockExecute.mockResolvedValueOnce(["Element 1"]);
    const actual = await sut.createTableEntryFromPrimitives(someData);
    expect(actual).toBe("Element 1");
  });
  it("should throw an error in CreateTableEntryFromPrimitives if first element is undefined", async () => {
    const someData = { data1: "someData" };
    mockExecute.mockResolvedValueOnce([]);
    const actual = await sut.createTableEntryFromPrimitives(someData);
    expect(actual).toBeInstanceOf(Error);
  });
});
