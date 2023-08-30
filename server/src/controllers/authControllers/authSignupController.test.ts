import { Request, Response } from "express";
import bcrypt from "bcrypt";
import authSignupController from "./authSignupController";

//mock the server / db class
const createNewUserMock = jest.fn();

jest.mock("../../server", () => {
  return {
    db: {
      getUserDB: jest.fn().mockImplementation(() => ({
        createNewUser: createNewUserMock,
      })),
    },
  };
});

//mock our response
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn();
const responseMock = { status: statusMock, json: jsonMock };

//mock bcrypt
const hashMock = jest.fn();
jest.mock("bcrypt", () => {
  return { hash: jest.fn().mockResolvedValue("hashedPW") };
});

describe("test suite for authSignup controller", () => {
  let req: Partial<Request> = {};
  let sut: (req: Request, res: Response) => Promise<Response | undefined>;
  const allMissingVariations = [
    noEmail,
    noFirstName,
    noLastName,
    noPassword,
    noPasswordConfirm,
    noOrganisation,
  ];

  beforeEach(() => {
    req.body = {};
    sut = authSignupController;
  });

  afterEach(() => jest.clearAllMocks());

  it.each(allMissingVariations)(
    "should return status 400 and message for missing fields",
    async (input) => {
      req.user = input;
      await sut(req as Request, responseMock as any as Response);
      expect(statusMock).toBeCalledWith(400);
      expect(jsonMock).toBeCalledWith("Missing some key information");
    }
  );

  it("should return status 400 and message if passwords don't match", async () => {
    req.body = user;
    await sut(req as Request, responseMock as any);
    expect(statusMock).toBeCalledWith(400);
    expect(jsonMock).toBeCalledWith("Passwords dont match");
  });

  it("should call bcrypt.hash with the user password", async () => {
    user.passwordConfirm = user.password;
    req.body = user;
    const bcryptSpy = jest.spyOn(bcrypt, "hash");
    await sut(req as Request, responseMock as any);
    expect(bcryptSpy).toBeCalledWith(user.password, 10);
  });

  it("shhould call createNewUser with the returned hash", async () => {
    req.body = user;
    const { passwordConfirm, ...removedPasswordUser } = user;
    const hashedUser = {
      ...removedPasswordUser,
      password: "hashedPW",
      privileges: "none",
    };

    await sut(req as Request, responseMock as any);
    expect(createNewUserMock).toBeCalled();
    expect(createNewUserMock).toBeCalledWith(hashedUser);
  });

  it("should return status 500 and message when creating new user returns error", async () => {
    req.body = user;
    createNewUserMock.mockResolvedValueOnce(Error());
    await sut(req as Request, responseMock as any);
    expect(statusMock).toBeCalledWith(500);
    expect(jsonMock).toBeCalledWith("There was an error in creating the user");
  });

  it("should return status 201 and message if successful", async () => {
    req.body = user;
    createNewUserMock.mockResolvedValueOnce({ insertId: 1 });
    await sut(req as Request, responseMock as any);
    expect(statusMock).toBeCalledWith(201);
    expect(jsonMock).toBeCalledWith(`New user was created with the id of 1`);
  });
});

var user = {
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  passwordConfirm: "passwordConfirm",
  organisation: "organisation",
};

var noEmail = {
  email: undefined,
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  passwordConfirm: "passwordConfirm",
  organisation: "organisation",
};

var noFirstName = {
  email: "email",
  firstName: undefined,
  lastName: "lastName",
  password: "password",
  passwordConfirm: "passwordConfirm",
  organisation: "organisation",
};

var noLastName = {
  email: "email",
  firstName: "firstName",
  lastName: undefined,
  password: "password",
  passwordConfirm: "passwordConfirm",
  organisation: "organisation",
};

var noPassword = {
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  password: undefined,
  passwordConfirm: "passwordConfirm",
  organisation: "organisation",
};

var noPasswordConfirm = {
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  passwordConfirm: undefined,
  organisation: "organisation",
};

var noOrganisation = {
  email: "email",
  firstName: "firstName",
  lastName: "lastName",
  password: "password",
  passwordConfirm: "passwordConfirm",
  organisation: undefined,
};
