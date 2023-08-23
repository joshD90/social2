import { Pool } from "mysql2/promise";
import UserDB from "./UserDB";
import { IUser } from "../../types/userTypes/UserType";
import { stubArray } from "lodash";

const mockExecute = jest.fn();
const mockQuery = jest.fn();

const connectionMock = {
  execute: mockExecute,
  query: mockQuery,
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

describe("test suite for userDB", () => {
  let sut: UserDB;

  beforeEach(() => {
    sut = new UserDB(connectionMock as any as Pool);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call the correct function for create new user and return correctly for creation and error", async () => {
    const createTableSpy = jest.spyOn(
      generalQueryMock,
      "createTableEntryFromPrimitives"
    );
    createTableEntryFromPrimitivesMock.mockResolvedValueOnce("dummy return");
    let actual = await sut.createNewUser({} as any as IUser);
    expect(createTableSpy).toBeCalledTimes(1);
    expect(actual).toBe("dummy return");

    createTableEntryFromPrimitivesMock.mockResolvedValueOnce(
      new Error("Some Message")
    );
    actual = await sut.createNewUser({} as any as IUser);
    expect(actual).toBeInstanceOf(Error);
    expect((actual as Error).message).toBe("Some Message");
  });

  it("should call correct function when calling deleteUser and return correctly as well as error handle", async () => {
    const deleteQuerySpy = jest.spyOn(
      generalQueryMock,
      "deleteBySingleCriteria"
    );
    deleteBySingleCritriaMock.mockResolvedValueOnce("deleted");
    let actual = await sut.deleteUser(1);
    expect(deleteQuerySpy).toBeCalledTimes(1);
    expect(actual).toBe("deleted");

    deleteBySingleCritriaMock.mockResolvedValueOnce(new Error("error message"));
    actual = await sut.deleteUser(1);
    expect(actual).toBeInstanceOf(Error);
    expect((actual as Error).message).toBe("error message");
  });

  it("should call correct function when calling findUser and return correctly or error throw", async () => {
    const findSpy = jest.spyOn(generalQueryMock, "findEntryBy");
    findEntryByMock.mockResolvedValueOnce("returned user");
    let actual = await sut.findUser(["email", "someEmail"]);

    expect(findSpy).toHaveBeenCalledTimes(1);
    expect(actual).toBe("returned user");

    findEntryByMock.mockResolvedValueOnce(new Error("some error"));
    actual = await sut.findUser(["email", "someEmail"]);
    expect(actual).toBeInstanceOf(Error);
    expect((actual as Error).message).toBe("some error");
  });
});
