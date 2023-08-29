import { Request, Response } from "express";
import updateServiceController from "./updateServiceController";

const deleteServiceAndRelatedEntriesMock = jest.fn();
const createFullServiceEntryMock = jest.fn();

jest.mock("../../server", () => ({
  db: {
    getServiceDB: () => ({
      deleteServiceAndRelatedEntries: deleteServiceAndRelatedEntriesMock,
      createFullServiceEntry: createFullServiceEntryMock,
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
    req = { params: {}, body: {} };
    sut = updateServiceController;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should res.status(401) if no req.user", async () => {
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(401);
    expect(jsonSpy).toBeCalledWith(
      "You are not Authorised to Update a Service. Must be an admin"
    );
  });

  it("should res.status(401) if user is not admin", async () => {
    req.user = { privileges: "user" };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(401);
    expect(jsonSpy).toBeCalledWith(
      "You are not Authorised to Update a Service. Must be an admin"
    );
  });

  it("should res.status(400) if no serviceId or serviceId is NaN", async () => {
    req.user = { privileges: "admin" };
    //undefined
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith(
      "Needs a Service Id in the form of a number"
    );
    req.params = { serviceId: "a" };
    //NaN
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith(
      "Needs a Service Id in the form of a number"
    );
  });

  it("should res.status(400) if serviceBase and subCategories are not included in body", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: undefined, serviceBase: undefined };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Not in proper format");
    //one undefined
    req.body = { subCategories: "something", serviceBase: undefined };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Not in proper format");
    //other one undefined
    req.body = { subCategories: undefined, serviceBase: "something" };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Not in proper format");
  });

  it("should call deleteServiceAndRelatedEntries if all previous criteria has been met", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: "something", serviceBase: "something" };
    await sut(req as Request, responseMock as any as Response);
    expect(deleteServiceAndRelatedEntriesMock).toBeCalledWith(1);
  });

  it("should res.status(500) if deleteServiceAndRelatedEntries returns an error", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: "something", serviceBase: "something" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(
      Error("some error")
    );
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(
      "Could not successfully delete Service Record"
    );
  });

  it("should call createFullServiceEntry with params from req.body if deletedSuccessfully", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: "somethingElse", serviceBase: "something" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
    await sut(req as Request, responseMock as any as Response);
    expect(createFullServiceEntryMock).toBeCalledWith(
      "something",
      "somethingElse"
    );
  });

  it("should res.status(500) if service is not created properly", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: "somethingElse", serviceBase: "something" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
    createFullServiceEntryMock.mockResolvedValueOnce(Error("some error"));
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(500);
    expect(jsonSpy).toBeCalledWith(
      "Service was deleted in preparation however an error occured when trying to add in updated version"
    );
  });
  it("should res.status(200) with appropriate json object if all is successful", async () => {
    req.user = { privileges: "admin" };
    req.params = { serviceId: "1" };
    req.body = { subCategories: "somethingElse", serviceBase: "something" };
    deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
    createFullServiceEntryMock.mockResolvedValueOnce({ insertId: 3 });

    await sut(req as Request, responseMock as any as Response);

    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith({ id: 3, message: "Successfully updated" });
  });
});
