import { Pool, ResultSetHeader } from "mysql2/promise";
import { GeneralQueryGenerator } from "./GeneralQueryGenerator";

const mockExecute = jest.fn();
const mockQuery = jest.fn();
//as far as this is concerned connection is not a function, treat it like a stub
export const connectionMock = {
  execute: mockExecute,
  query: mockQuery,
};

describe("General Query Generator Test Suite", () => {
  let sut: GeneralQueryGenerator;
  beforeEach(() => {
    sut = new GeneralQueryGenerator("table1", connectionMock as any as Pool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return the table name for the name getter", () => {
    const actual = sut.getTableName();
    expect(actual).toBe("table1");
  });

  //CreateTableEntryFromPrimitives
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

  //findBy Method
  it("should return from findBy first element that connection.execute returns if successful", async () => {
    mockExecute.mockResolvedValueOnce([
      "resolved value",
      "second resolved value",
    ]);
    const actual = await sut.findEntryBy();
    expect(actual).toBe("resolved value");
  });

  it("should return from findBy an Error if connection.execute is unsuccessful", async () => {
    mockExecute.mockResolvedValueOnce(undefined);
    let actual = await sut.findEntryBy();
    expect(actual).toBeInstanceOf(Error);
    mockExecute.mockResolvedValueOnce([]);
    actual = await sut.findEntryBy();
    expect(actual).toBeInstanceOf(Error);
  });

  describe("Test Suite for deleteBy Single Criteria", () => {
    //Delete by Single Criteria
    test("should return resultSetHeader from deleteBySingleCriteria if successfully deleted", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const actual = await sut.deleteBySingleCriteria("column1", 1);
      expect(actual).toEqual({ affectedRows: 1 });
    });
    test("should return Error from deteleBySingleCriteria if unsuccessful in deletion", async () => {
      mockExecute.mockResolvedValueOnce({
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: "",
        serverStatus: 34,
        warningStatus: 0,
      });
      const actual = await sut.deleteBySingleCriteria("column1", 1);
      console.log(actual);
      expect(actual).toBeInstanceOf(Error);
    });
  });

  describe("test suite for deleteByTwoCriteria", () => {
    const cols = ["col1", "col2"];
    const vals = ["val1", "val2"];
    it("should return resultSetHeader if successfully deleted", async () => {
      const executeSpy = jest.spyOn(connectionMock, "execute");
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const actual = await sut.deleteByTwoCriteria(cols, vals);
      expect(executeSpy).toBeCalledTimes(1);
      expect(actual).toEqual({ affectedRows: 1 });
    });

    it("should return Error if unsuccessful in deletion", async () => {
      mockExecute
        .mockResolvedValueOnce([{ affectedRows: 0 }])
        .mockResolvedValueOnce(undefined);
      let actual = await sut.deleteByTwoCriteria(cols, vals);
      expect(actual).toBeInstanceOf(Error);
      actual = await sut.deleteByTwoCriteria(cols, vals);
      expect(actual).toBeInstanceOf(Error);
    });
  });

  describe("test suite for updateTableEntriesByMultiple", () => {
    it("should call connection.execute once and return a result.setHeader", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 1 }]);
      const executeSpy = jest.spyOn(connectionMock, "execute");
      const actual = await sut.updateEntriesByMultiple(
        { something: "something" },
        "fieldValue",
        "fieldName"
      );
      expect(executeSpy).toHaveBeenCalled();
      expect(actual).toEqual({ affectedRows: 1 });
    });

    it("should return error for no affectedRows or undefined return", async () => {
      mockExecute.mockResolvedValueOnce([{ affectedRows: 0 }]);
      let actual = await sut.updateEntriesByMultiple(
        { something: "something" },
        "fieldValue",
        "fieldName"
      );
      expect(actual).toBeInstanceOf(Error);
      mockExecute.mockResolvedValueOnce(undefined);
      actual = await sut.updateEntriesByMultiple(
        { something: "something" },
        "fieldValue",
        "fieldName"
      );
      expect(actual).toBeInstanceOf(Error);
    });
  });
});
