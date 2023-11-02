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
Object.defineProperty(exports, "__esModule", { value: true });
const FindAllCategories_1 = require("./FindAllCategories");
//mock our server and contained DB
const findEntryByMock = jest.fn();
const getCategoryQueriesMock = { findEntryBy: findEntryByMock };
const getCategoryDBMock = { getCategoryQueries: () => getCategoryQueriesMock };
jest.mock("../../server", () => ({
    db: { getCategoryDB: () => getCategoryDBMock },
}));
//response mock
const responseStatusMock = jest.fn().mockReturnThis();
const responseJsonMock = jest.fn();
const responseSendMock = jest.fn();
const responseMock = {
    status: responseStatusMock,
    json: responseJsonMock,
    send: responseSendMock,
};
describe("findAllCategories controller test suite", () => {
    let sut;
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    beforeEach(() => {
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
        sut = FindAllCategories_1.findAllCategories;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should call call findEntryByMock once", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut({}, responseMock);
        expect(findEntryByMock).toBeCalledWith();
    }));
    it("should res.status(500) if the findEntryBy returns Error", () => __awaiter(void 0, void 0, void 0, function* () {
        findEntryByMock.mockResolvedValueOnce(Error("some error"));
        yield sut({}, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith(Error("some error"));
    }));
    it("should return a mapped result in the right format with correct findEntryByMock", () => __awaiter(void 0, void 0, void 0, function* () {
        const returnedCategories = [
            { id: 1, categoryName: "one", forwardTo: "one" },
            { id: 2, categoryName: "two", forwardTo: "two" },
        ];
        const expectedCategories = [
            { id: 1, name: "one", forwardTo: "one", categoryName: "one" },
            { id: 2, name: "two", forwardTo: "two", categoryName: "two" },
        ];
        findEntryByMock.mockResolvedValueOnce(returnedCategories);
        yield sut({}, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith(expectedCategories);
    }));
});
