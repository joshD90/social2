import { Request, Response } from "express";

import userDataController from "./userDataController";

const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn().mockReturnThis();
const responseMock = { status: statusMock, json: jsonMock };

describe("userDataController test suite", () => {
  const req: Partial<Request> = {};
  const sut = userDataController;

  afterEach(() => jest.clearAllMocks());

  it("should call res.status(401) and res.json for no user in request", () => {
    sut(req as Request, responseMock as any as Response);
    expect(statusMock).toBeCalledWith(401);
    expect(jsonMock).toBeCalledWith("Your Credentials are Invalid");
  });

  it("should call res.status(200) for user present in request", () => {
    req.user = "myUser";
    sut(req as Request, responseMock as any as Response);

    expect(statusMock).toBeCalledWith(200);
    expect(jsonMock).toBeCalledWith("myUser");
  });
});
