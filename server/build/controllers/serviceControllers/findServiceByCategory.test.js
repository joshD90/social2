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
const findServiceByCategory_1 = require("./findServiceByCategory");
const findEntryByMock = jest.fn();
const BaseTableQueriesMock = {
    findEntryBy: findEntryByMock,
};
jest.mock("../../server", () => ({
    db: {
        getServiceDB: () => ({ getBaseTableQueries: () => BaseTableQueriesMock }),
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
describe("findServiceByCategory test suite", () => {
    let req;
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    let sut;
    beforeEach(() => {
        sut = findServiceByCategory_1.findServicesByCategory;
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
        req = { params: {} };
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should res.status(400).json() if no category provided", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("You need to include a category as part of params");
    }));
    it("should call findEntryBy with correct params", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { category: "someCategory" };
        yield sut(req, responseMock);
        expect(findEntryByMock).toBeCalledWith("category", "someCategory");
    }));
    it("should res.status(500).json() if findEntryBy returns Error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { category: "someCategory" };
        findEntryByMock.mockResolvedValueOnce(Error("Some Error"));
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith(Error("Some Error"));
    }));
    it("shoud return correct result if no issues", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { category: "someCategory" };
        findEntryByMock.mockResolvedValueOnce({ result: "someResult" });
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith({ result: "someResult" });
    }));
});
