"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authSigninController_1 = __importDefault(require("./authSigninController"));
//env mock
jest.mock("../../env/envConfig", () => ({
    auth: { jwtSecret: "some secret" },
}));
//jwt mock
const signMock = jest.fn();
jest.mock("jsonwebtoken", () => (Object.assign(Object.assign({}, jest.requireActual("jsonwebtoken")), { sign: () => signMock.mockReturnValue("some string") })));
//response mock
const cookieMock = jest.fn().mockReturnThis();
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn();
const responseMock = { cookie: cookieMock, status: statusMock, json: jsonMock };
describe("authSigninController test suite", () => {
    let req;
    let sut;
    const userObj = {
        email: "email",
        id: 1,
        privileges: "user",
        firstName: "josh",
        lastName: "lastName",
    };
    let signSpy;
    beforeEach(() => {
        req = { user: undefined };
        sut = authSigninController_1.default;
        signSpy = jest.spyOn(jsonwebtoken_1.default, "sign");
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should res.status(401) if there is no user object", () => {
        sut(req, responseMock);
        expect(statusMock).toBeCalledWith(401);
        expect(jsonMock).toBeCalledWith("There was an issue with verifying your credentials");
    });
    it("should call jwt.sign with user, jwt secret and expiry if there is a user", () => {
        req.user = userObj;
        sut(req, responseMock);
        expect(signSpy).toHaveBeenCalledWith(userObj, "some secret", {
            expiresIn: "1d",
        });
    });
    it("should call response.cookie / status /json with correct params", () => {
        req.user = userObj;
        signSpy.mockReturnValueOnce("some token");
        sut(req, responseMock);
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
        sut(req, responseMock);
        expect(statusMock).toBeCalledWith(401);
        expect(jsonMock).toBeCalledWith({
            message: "There was an error loggin in",
        });
    });
});
