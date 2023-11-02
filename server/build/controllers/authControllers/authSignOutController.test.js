"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authSignOutController_1 = __importDefault(require("./authSignOutController"));
const clearCookieMock = jest.fn().mockReturnThis();
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn();
const responseMock = {
    clearCookie: clearCookieMock,
    status: statusMock,
    json: jsonMock,
};
describe("test suite for authSignOutController", () => {
    const sut = authSignOutController_1.default;
    afterEach(() => jest.clearAllMocks());
    it("should call res.clearCookie / status /json with correct params", () => {
        sut({}, responseMock);
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
        sut({}, responseMock);
        expect(statusMock).toBeCalledWith(500);
        expect(jsonMock).toBeCalledWith({ message: "some error" });
    });
});
