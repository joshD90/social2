import { Request, Response } from "express";
import createServiceController from "./createServiceController";

const createFullServiceEntryMock = jest.fn();
const ServiceDBMock = { createFullServiceEntry: createFullServiceEntryMock };

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

describe("createServiceContoller test suite", () => {
  let sut: (req: Request, res: Response) => Promise<Response | undefined> =
    createServiceController;
  let req: Partial<Request>;
  let responseStatusMockSpy: jest.SpyInstance;
  let responseJsonMockSpy: jest.SpyInstance;
  beforeEach(() => {
    responseStatusMockSpy = jest.spyOn(responseMock, "status");
    responseJsonMockSpy = jest.spyOn(responseMock, "json");
    req = { body: {}, user: undefined };
  });

  afterEach(() => jest.clearAllMocks());

  it("should return res.status(401).json() if no req.user", async () => {
    await sut(req as Request, responseMock as any as Response);

    expect(responseStatusMockSpy).toBeCalledWith(401);
    expect(responseJsonMockSpy).toBeCalledWith(
      "You are not Authorised to Create a Service. Must be an admin"
    );
  });

  it("should return res.status(401).json() if not admin", async () => {
    req.user = { privileges: "user" };
    await sut(req as Request, responseMock as any as Response);
    expect(responseStatusMockSpy).toBeCalledWith(401);
    expect(responseJsonMockSpy).toBeCalledWith(
      "You are not Authorised to Create a Service. Must be an admin"
    );
  });

  it("should call createFullServiceEntry with req.body information if user is present", async () => {
    req.user = { privileges: "admin" };
    req.body = { serviceBase: "serviceBase", subCategories: [] };
    const createFullServiceEntrySpy = jest.spyOn(
      ServiceDBMock,
      "createFullServiceEntry"
    );
    createFullServiceEntryMock.mockResolvedValue({ insertId: 1 });
    await sut(req as Request, responseMock as any as Response);
    expect(createFullServiceEntrySpy).toBeCalled();
    expect(createFullServiceEntrySpy).toBeCalledWith("serviceBase", []);
  });

  it("should call res.status(500).json() if service isn't successfully saved", async () => {
    req.user = { privileges: "admin" };
    const responseSendMockSpy = jest.spyOn(responseMock, "send");
    createFullServiceEntryMock.mockResolvedValueOnce(Error("Some Error"));
    await sut(req as Request, responseMock as any as Response);
    expect(responseStatusMockSpy).toBeCalledWith(500);
    expect(responseSendMockSpy).toBeCalledWith(
      `Could not create the service due to Some Error`
    );
  });

  it("should send back the insertId if no issues creating service", async () => {
    req.user = { privileges: "admin" };
    createFullServiceEntryMock.mockResolvedValueOnce({ insertId: 1 });
    await sut(req as Request, responseMock as any as Response);
    expect(responseStatusMockSpy).toBeCalledWith(201);
    expect(responseJsonMockSpy).toBeCalledWith({
      id: 1,
      message: `Service created with base service having an id of 1`,
    });
  });
});
