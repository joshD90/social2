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
const findServiceByIdController_1 = require("./findServiceByIdController");
const fetchServiceAndRelatedEntriesMock = jest.fn();
jest.mock("../../server", () => ({
    db: {
        getServiceDB: () => ({
            fetchServiceAndRelatedEntries: fetchServiceAndRelatedEntriesMock,
        }),
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
describe("findServiceByIdController test suite", () => {
    let req;
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    let sut;
    beforeEach(() => {
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
        req = { params: {} };
        sut = findServiceByIdController_1.findServiceByIdController;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should res.status(400) if no serviceId", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Needs a serviceId");
    }));
    it("should call fetchServiceAndRelatedEntries if serviceId is present", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        yield sut(req, responseMock);
        expect(fetchServiceAndRelatedEntriesMock).toBeCalledWith(1);
    }));
    it("should res.status(404) if fetchServiceAndRelatedEntries returns undefined", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce(undefined);
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(404);
        expect(jsonSpy).toBeCalledWith("Could not find relevant entry");
    }));
    it("should res.status(500) if fetchServiceAndRelatedEntries returns Error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce(Error("some message"));
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith(Error("some message"));
    }));
    it("should res.status(500) if fetchServiceAndRelatedEntries returns Error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        fetchServiceAndRelatedEntriesMock.mockResolvedValueOnce({
            result: "someResult",
        });
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith({ result: "someResult" });
    }));
});
