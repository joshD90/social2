import { Request, Response } from "express";

import getAllServicesController from "./getAllServicesController";

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
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let sut: (req: Request, res: Response) => Promise<void>;

  beforeEach(() => {
    sut = getAllServicesController;
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call findEntryBy", async () => {
    await sut({} as Request, responseMock as any as Response);
    expect(findEntryByMock).toBeCalled();
  });

  it("should res.status(500) if findEntryBy returns an error", async () => {
    findEntryByMock.mockResolvedValueOnce(Error("Some Error"));
    await sut({} as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith("Issue with fetching services from DB");
  });

  it("should res.status(200) if findEntryBy returns properly", async () => {
    findEntryByMock.mockResolvedValueOnce(["service1", "service2", "service3"]);
    await sut({} as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith(["service1", "service2", "service3"]);
  });
});
