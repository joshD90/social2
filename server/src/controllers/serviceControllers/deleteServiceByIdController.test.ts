import { Request, Response } from "express";
import deleteServiceByIdController from "./deleteServiceByIdController";

const deleteServiceAndRelatedEntriesMock = jest.fn();
const ServiceDBMock = {
  deleteServiceAndRelatedEntries: deleteServiceAndRelatedEntriesMock,
};

jest.mock("../../server", () => ({
  db: {
    getServiceDB: () => ServiceDBMock,
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

describe("test suite for deleteSErviceByIdController", () => {
  let req: Partial<Request>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let sut: (res: Request, req: Response) => Promise<Response>;

  beforeEach(() => {
    req = { body: {}, user: undefined };
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
    sut = deleteServiceByIdController;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should call res.status(401).json() if not a user", async () => {
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(401);
    expect(jsonSpy).toBeCalledWith(
      "You are not Authorised to Delete a Service. Must be an admin"
    );
  });

  it("should call res.status(401).json() if not admin", async () => {
    req.user = { privileges: "user" };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(401);
    expect(jsonSpy).toBeCalledWith(
      "You are not Authorised to Delete a Service. Must be an admin"
    );
  });

  it("should call res.status(400).json() if serviceId is not a number but user is admin", async () => {
    req.params = { serviceId: "a" };
    req.user = { privileges: "admin" };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Service Id Provided is not a number");
  });

  it("should call res.status(500).json() if deleteServiceAndRelatedEntries returns an error", async () => {
    req.params = { serviceId: "1" };
    req.user = { privileges: "admin" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(
      Error("Some Error")
    );
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(
      "There was an error in deleting this record"
    );
  });

  it("should call res.status(204).json() if successfully deleted", async () => {
    req.params = { serviceId: "1" };
    req.user = { privileges: "admin" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(204);
    expect(jsonSpy).toBeCalledWith("deleted");
  });
});
