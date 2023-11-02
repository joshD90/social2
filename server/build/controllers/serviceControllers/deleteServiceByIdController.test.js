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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const deleteServiceByIdController_1 = __importDefault(require("./deleteServiceByIdController"));
const deleteServiceAndRelatedEntriesMock = jest.fn();
const ServiceDBMock = {
    deleteServiceAndRelatedEntries: deleteServiceAndRelatedEntriesMock,
};
jest.mock("../../server", () => ({
    db: {
        getServiceDB: () => ServiceDBMock,
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
describe("test suite for deleteSErviceByIdController", () => {
    let req;
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    let sut;
    beforeEach(() => {
        req = { body: {}, user: undefined };
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
        sut = deleteServiceByIdController_1.default;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should call res.status(401).json() if not a user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(401);
        expect(jsonSpy).toBeCalledWith("You are not Authorised to Delete a Service. Must be an admin");
    }));
    it("should call res.status(401).json() if not admin", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "user" };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(401);
        expect(jsonSpy).toBeCalledWith("You are not Authorised to Delete a Service. Must be an admin");
    }));
    it("should call res.status(400).json() if serviceId is not a number but user is admin", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "a" };
        req.user = { privileges: "admin" };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Service Id Provided is not a number");
    }));
    it("should call res.status(500).json() if deleteServiceAndRelatedEntries returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        req.user = { privileges: "admin" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(Error("Some Error"));
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith("There was an error in deleting this record");
    }));
    it("should call res.status(204).json() if successfully deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { serviceId: "1" };
        req.user = { privileges: "admin" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(204);
        expect(jsonSpy).toBeCalledWith("deleted");
    }));
});
