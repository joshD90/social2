import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import authSignInController from "./authSigninController";

//env mock
jest.mock("../../env/envConfig", () => ({
  auth: { jwtSecret: "some secret" },
}));

//jwt mock
const signMock = jest.fn();
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  sign: () => signMock.mockReturnValue("some string"),
}));

//response mock
const cookieMock = jest.fn().mockReturnThis();
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn();

const responseMock = { cookie: cookieMock, status: statusMock, json: jsonMock };

describe("authSigninController test suite", () => {
  let req: Partial<Request>;
  let sut: (req: Request, res: Response) => Response;
  const userObj = {
    email: "email",
    id: 1,
    privileges: "user",
    firstName: "josh",
    lastName: "lastName",
  };
  let signSpy: jest.SpyInstance;

  beforeEach(() => {
    req = { user: undefined };
    sut = authSignInController;
    signSpy = jest.spyOn(jwt, "sign");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should res.status(401) if there is no user object", () => {
    sut(req as Request, responseMock as any as Response);
    expect(statusMock).toBeCalledWith(401);
    expect(jsonMock).toBeCalledWith(
      "There was an issue with verifying your credentials"
    );
  });

  it("should call jwt.sign with user, jwt secret and expiry if there is a user", () => {
    req.user = userObj;

    sut(req as Request, responseMock as any as Response);

    expect(signSpy).toHaveBeenCalledWith(userObj, "some secret", {
      expiresIn: "1d",
    });
  });

  it("should call response.cookie / status /json with correct params", () => {
    req.user = userObj;
    signSpy.mockReturnValueOnce("some token");
    sut(req as Request, responseMock as any as Response);
    expect(cookieMock).toBeCalledWith("jwt", "some token", {
      httpOnly: true,
      secure: false,
    });
    expect(statusMock).toBeCalledWith(200);
    expect(jsonMock).toBeCalledWith(userObj);
  });

  it("should res.status(401) if jwt.sign throws an error", () => {
    req.user = userObj;
    signSpy.mockImplementationOnce(() => {
      throw new Error();
    });
    sut(req as Request, responseMock as any as Response);

    expect(statusMock).toBeCalledWith(401);
    expect(jsonMock).toBeCalledWith({
      message: "There was an error loggin in",
    });
  });
});
