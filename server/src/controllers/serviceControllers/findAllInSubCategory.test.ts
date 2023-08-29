import { Request, Response } from "express";
import { findAllInSubCategory } from "./findAllInSubCategory";

const fetchAllSubCategoryEntriesMock = jest.fn();
const ServiceDBMock = {
  fetchAllSubCategoryEntries: fetchAllSubCategoryEntriesMock,
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

describe("findAllInSubCategory test suite", () => {
  let req: Partial<Request>;
  let statusSpy: jest.SpyInstance;
  let jsonSpy: jest.SpyInstance;
  let sendSpy: jest.SpyInstance;
  let sut: (req: Request, res: Response) => Promise<Response | undefined>;

  beforeEach(() => {
    req = {};
    statusSpy = jest.spyOn(responseMock, "status");
    jsonSpy = jest.spyOn(responseMock, "json");
    sendSpy = jest.spyOn(responseMock, "send");
    sut = findAllInSubCategory;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return res.status(400).json() if the req.params does not match table name", async () => {
    req.params = { subCategory: "someTable" };
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(400);
    expect(jsonSpy).toBeCalledWith("Wrong Table Name");
  });

  it("should call fetchAllSubCategoryEntries with correct table name", async () => {
    req.params = { subCategory: "areasServed" };
    await sut(req as Request, responseMock as any as Response);
    expect(fetchAllSubCategoryEntriesMock).toBeCalledWith("areasServed");
  });

  it("should return res.status(404).json()", async () => {
    req.params = { subCategory: "areasServed" };
    fetchAllSubCategoryEntriesMock.mockResolvedValueOnce(Error());
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(404);
    expect(jsonSpy).toBeCalledWith("Could not Find Resources");
  });

  it("should respond with status(200) and result if no issues", async () => {
    req.params = { subCategory: "needsMet" };
    fetchAllSubCategoryEntriesMock.mockResolvedValueOnce({
      someValue: "value",
    });
    await sut(req as Request, responseMock as any as Response);
    expect(statusSpy).toBeCalledWith(200);
    expect(jsonSpy).toBeCalledWith({ someValue: "value" });
  });
});
