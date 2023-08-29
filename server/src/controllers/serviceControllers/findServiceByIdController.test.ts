import { Request, Response } from "express";
import { findServiceByIdController } from "./findServiceByIdController";

const fetchServiceAndRelatedEntriesMock = jest.fn();

jest.mock("../../server", () => ({
  db: {
    getServiceDB: () => ({
      fetchServiceAndRelatedEntries: fetchServiceAndRelatedEntriesMock,
    }),
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

describe("findServiceByIdController test suite", () => {
  let req: Partial<Request>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let sut: (req: Request, res: Response) => Promise<Response | undefined>;

  beforeEach(() => {
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
    req = { params: {} };
    sut = findServiceByIdController;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should res.status(400) if no serviceId", async () => {
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Needs a serviceId");
  });

  it("should call fetchServiceAndRelatedEntries if serviceId is present", async () => {
    req.params = { serviceId: "1" };
    await sut(req as Request, responseMock as any as Response);
    expect(fetchServiceAndRelatedEntriesMock).toBeCalledWith(1);
  });

  it("should res.status(404) if fetchServiceAndRelatedEntries returns undefined", async () => {
    req.params = { serviceId: "1" };
    fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce(undefined);
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(404);
    expect(jsonSpy).toBeCalledWith("Could not find relevant entry");
  });

  it("should res.status(500) if fetchServiceAndRelatedEntries returns Error", async () => {
    req.params = { serviceId: "1" };
    fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce(
      Error("some message")
    );
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(Error("some message"));
  });

  it("should res.status(500) if fetchServiceAndRelatedEntries returns Error", async () => {
    req.params = { serviceId: "1" };
    fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce({
      result: "someResult",
    });
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith({ result: "someResult" });
  });
});
