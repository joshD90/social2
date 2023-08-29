import { Request, Response } from "express";
import { findAllCategories } from "./FindAllCategories";

//mock our server and contained DB
const findEntryByMock = jest.fn();
const getCategoryQueriesMock = { findEntryBy: findEntryByMock };
const getCategoryDBMock = { getCategoryQueries: () => getCategoryQueriesMock };

jest.mock("../../server", () => ({
  db: { getCategoryDB: () => getCategoryDBMock },
}));

//response mock
const responseStatusMock = jest.fn().mockReturnThis();
const responseJsonMock = jest.fn();
const responseSendMock = jest.fn();

const responseMock = {
  status: responseStatusMock,
  json: responseJsonMock,
  send: responseSendMock,
};

describe("findAllCategories controller test suite", () => {
  let sut: (req: Request, res: Response) => Promise<void>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;

  beforeEach(() => {
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
    sut = findAllCategories;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call call findEntryByMock once", async () => {
    await sut({} as Request, responseMock as any as Response);
    expect(findEntryByMock).toBeCalledWith();
  });

  it("should res.status(500) if the findEntryBy returns Error", async () => {
    findEntryByMock.mockResolvedValueOnce(Error("some error"));
    await sut({} as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(Error("some error"));
  });

  it("should return a mapped result in the right format with correct findEntryByMock", async () => {
    const returnedCategories = [
      { id: 1, categoryName: "one", forwardTo: "one" },
      { id: 2, categoryName: "two", forwardTo: "two" },
    ];
    const expectedCategories = [
      { id: 1, name: "one", forwardTo: "one", categoryName: "one" },
      { id: 2, name: "two", forwardTo: "two", categoryName: "two" },
    ];
    findEntryByMock.mockResolvedValueOnce(returnedCategories);
    await sut({} as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith(expectedCategories);
  });
});
