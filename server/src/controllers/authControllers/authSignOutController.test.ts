import { Request, Response } from "express";

import authSignOutController from "./authSignOutController";

const clearCookieMock = jest.fn().mockReturnThis();
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn();
const responseMock = {
  clearCookie: clearCookieMock,
  status: statusMock,
  json: jsonMock,
};

describe("test suite for authSignOutController", () => {
  const sut = authSignOutController;

  afterEach(() => jest.clearAllMocks());

  it("should call res.clearCookie / status /json with correct params", () => {
    sut({} as Request, responseMock as any as Response);
    expect(clearCookieMock).toBeCalledWith("jwt", {
      httpOnly: true,
      secure: false,
    });
    expect(statusMock).toBeCalledWith(200);
    expect(jsonMock).toBeCalledWith({ message: "Logout Success" });
  });

  it("should call res.status and json when an error is thrown", () => {
    clearCookieMock.mockImplementationOnce(() => {
      throw new Error("some error");
    });
    sut({} as Request, responseMock as any as Response);
    expect(statusMock).toBeCalledWith(500);
    expect(jsonMock).toBeCalledWith({ message: "some error" });
  });
});
