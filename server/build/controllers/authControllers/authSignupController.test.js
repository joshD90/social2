"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const authSignupController_1 = __importDefault(require("./authSignupController"));
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
    let req = {};
    let sut;
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
        sut = authSignupController_1.default;
    });
    afterEach(() => jest.clearAllMocks());
    it.each(allMissingVariations)("should return status 400 and message for missing fields", (input) => __awaiter(void 0, void 0, void 0, function* () {
        req.user = input;
        yield sut(req, responseMock);
        expect(statusMock).toBeCalledWith(400);
        expect(jsonMock).toBeCalledWith("Missing some key information");
    }));
    it("should return status 400 and message if passwords don't match", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = user;
        yield sut(req, responseMock);
        expect(statusMock).toBeCalledWith(400);
        expect(jsonMock).toBeCalledWith("Passwords dont match");
    }));
    it("should call bcrypt.hash with the user password", () => __awaiter(void 0, void 0, void 0, function* () {
        user.passwordConfirm = user.password;
        req.body = user;
        const bcryptSpy = jest.spyOn(bcrypt_1.default, "hash");
        yield sut(req, responseMock);
        expect(bcryptSpy).toBeCalledWith(user.password, 10);
    }));
    it("shhould call createNewUser with the returned hash", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = user;
        const { passwordConfirm } = user, removedPasswordUser = __rest(user, ["passwordConfirm"]);
        const hashedUser = Object.assign(Object.assign({}, removedPasswordUser), { password: "hashedPW", privileges: "none" });
        yield sut(req, responseMock);
        expect(createNewUserMock).toBeCalled();
        expect(createNewUserMock).toBeCalledWith(hashedUser);
    }));
    it("should return status 500 and message when creating new user returns error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = user;
        createNewUserMock.mockResolvedValueOnce(Error());
        yield sut(req, responseMock);
        expect(statusMock).toBeCalledWith(500);
        expect(jsonMock).toBeCalledWith("There was an error in creating the user");
    }));
    it("should return status 201 and message if successful", () => __awaiter(void 0, void 0, void 0, function* () {
        req.body = user;
        createNewUserMock.mockResolvedValueOnce({ insertId: 1 });
        yield sut(req, responseMock);
        expect(statusMock).toBeCalledWith(201);
        expect(jsonMock).toBeCalledWith(`New user was created with the id of 1`);
    }));
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
