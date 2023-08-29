import { Request, Response } from "express";

import { findServicesByCategory } from "./findServiceByCategory";

const findEntryByMock = jest.fn();
const BaseTableQueriesMock = {
  findEntryBy: findEntryByMock,
};

jest.mock("../../server", () => ({
  db: {
    getServiceDB: () => ({ getBaseTableQueries: () => BaseTableQueriesMock }),
  },
}));

const responseStatusMock = jest.fn().mockReturnThis();
const responseJsonMock = jest.fn();
const responseSendMock = jest.fn();

const responseMock = {
  status: responseStatusMock,
  json: responseJsonMock,
  send: responseSendMock,
};

describe("findServiceByCategory test suite", () => {
  let req: Partial<Request>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let sut: (req: Request, res: Response) => Promise<Response | undefined>;

  beforeEach(() => {
    sut = findServicesByCategory;
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
    req = { params: {} };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should res.status(400).json() if no category provided", async () => {
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith(
      "You need to include a category as part of params"
    );
  });

  it("should call findEntryBy with correct params", async () => {
    req.params = { category: "someCategory" };
    await sut(req as Request, responseMock as any as Response);
    expect(findEntryByMock).toBeCalledWith("category", "someCategory");
  });

  it("should res.status(500).json() if findEntryBy returns Error", async () => {
    req.params = { category: "someCategory" };
    findEntryByMock.mockResolvedValueOnce(Error("Some Error"));
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(Error("Some Error"));
  });

  it("shoud return correct result if no issues", async () => {
    req.params = { category: "someCategory" };
    findEntryByMock.mockResolvedValueOnce({ result: "someResult" });
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith({ result: "someResult" });
  });
});
