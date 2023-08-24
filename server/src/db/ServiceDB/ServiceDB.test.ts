import { Pool } from "mysql2/promise";
import { ServiceDB } from "./ServiceDB";
import { IService } from "../../types/serviceTypes/ServiceType";

//mocks
const mockExecute = jest.fn();
const mockQuery = jest.fn();
const beginTransactionMock = jest.fn();
const commitMock = jest.fn();
const rollbackMock = jest.fn();

const getConnectionReturn = {
  execute: mockExecute,
  query: mockQuery,
  beginTransaction: beginTransactionMock,
  commit: commitMock,
  rollback: rollbackMock,
};

const connectionMock = {
  ...getConnectionReturn,
  getConnection: jest.fn().mockImplementation(() => getConnectionReturn),
};

const createTableEntryFromPrimitivesMock = jest.fn();
const deleteBySingleCritriaMock = jest.fn();
const findEntryByMock = jest.fn();

const generalQueryMock = {
  createTableEntryFromPrimitives: createTableEntryFromPrimitivesMock,
  findEntryBy: findEntryByMock,
  deleteBySingleCriteria: deleteBySingleCritriaMock,
  deleteByTwoCriteria: jest.fn(),
  updateEntriesByMultiple: jest.fn(),
};

jest.mock("../generalQueryGenerator/GeneralQueryGenerator", () => ({
  GeneralQueryGenerator: jest.fn().mockImplementation(() => generalQueryMock),
}));

describe("ServiceDB test suite", () => {
  let sut: ServiceDB;

  beforeEach(() => {
    sut = new ServiceDB(connectionMock as any as Pool);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Init Service Tables test suite", () => {
    it("should test to see that the necessary calls have occurred for setting up the table", async () => {
      const querySpy = jest.spyOn(getConnectionReturn, "query");
      await sut.initialiseServiceRelatedTables();
      expect(querySpy).toBeCalledTimes(8);
    });
  });

  describe("Create Full Service Entry test suite", () => {
    it("should call beginTransaction", async () => {
      const beginTransactionSpy = jest.spyOn(
        getConnectionReturn,
        "beginTransaction"
      );
      await sut.createFullServiceEntry({} as IService, []);
      expect(beginTransactionSpy).toBeCalledTimes(1);
    });

    it("should call createTableEntryFromPrimitives with first parameter", async () => {
      const createEntrySpy = jest.spyOn(
        generalQueryMock,
        "createTableEntryFromPrimitives"
      );
      await sut.createFullServiceEntry({ foo: "bar" } as any as IService, []);
      expect(createEntrySpy).toBeCalledTimes(1);
      expect(createEntrySpy).toBeCalledWith({ foo: "bar" });
    });

    it("should return an Error and Rollback if createTableEntryFromPrimitives returns an error", async () => {
      const rollbackSpy = jest.spyOn(connectionMock, "rollback");
      createTableEntryFromPrimitivesMock.mockResolvedValueOnce(new Error());
      const actual = await sut.createFullServiceEntry({} as any, []);
      expect(actual).toBeInstanceOf(Error);
      expect((actual as Error).message).toBe(
        "Could not make the base table for service"
      );
      expect(rollbackSpy).toBeCalled();
    });

    it("should call addFullSubCategory when mapping subCategories", async () => {
      const addFullSubCategorySpy = jest.spyOn(sut, "addFullSubCategory");
      createTableEntryFromPrimitivesMock.mockResolvedValueOnce({ insertId: 1 });
      const subServiceCategory = { value: "something", exclusive: true };

      await sut.createFullServiceEntry({} as any, [
        { areasServed: [subServiceCategory] },
      ]);
      expect(addFullSubCategorySpy).toHaveBeenCalled();
    });

    it("should return an error if the successArray contains failure", async () => {
      jest.spyOn(sut, "addFullSubCategory").mockResolvedValueOnce("failure");
      const connectionRollbackSpy = jest.spyOn(connectionMock, "rollback");
      createTableEntryFromPrimitivesMock.mockResolvedValueOnce({ insertId: 1 });
      const subServiceCategory = { value: "something", exclusive: true };
      const actual = await sut.createFullServiceEntry({} as any, [
        { areasServed: [subServiceCategory] },
      ]);
      expect(actual).toBeInstanceOf(Error);
      expect(connectionRollbackSpy).toBeCalled();
    });
  });
});
