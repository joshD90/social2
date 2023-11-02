"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDataController_1 = __importDefault(require("./userDataController"));
const statusMock = jest.fn().mockReturnThis();
const jsonMock = jest.fn().mockReturnThis();
const responseMock = { status: statusMock, json: jsonMock };
describe("userDataController test suite", () => {
    const req = {};
    const sut = userDataController_1.default;
    afterEach(() => jest.clearAllMocks());
    it("should call res.status(401) and res.json for no user in request", () => {
        sut(req, responseMock);
        expect(statusMock).toBeCalledWith(401);
        expect(jsonMock).toBeCalledWith("Your Credentials are Invalid");
    });
    it("should call res.status(200) for user present in request", () => {
        req.user = "myUser";
        sut(req, responseMock);
        expect(statusMock).toBeCalledWith(200);
        expect(jsonMock).toBeCalledWith("myUser");
    });
});
