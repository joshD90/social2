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
const getAllServicesController_1 = __importDefault(require("./getAllServicesController"));
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
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    let sut;
    beforeEach(() => {
        sut = getAllServicesController_1.default;
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should call findEntryBy", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut({}, responseMock);
        expect(findEntryByMock).toBeCalled();
    }));
    it("should res.status(500) if findEntryBy returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        findEntryByMock.mockResolvedValueOnce(Error("Some Error"));
        yield sut({}, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith("Issue with fetching services from DB");
    }));
    it("should res.status(200) if findEntryBy returns properly", () => __awaiter(void 0, void 0, void 0, function* () {
        findEntryByMock.mockResolvedValueOnce(["service1", "service2", "service3"]);
        yield sut({}, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith(["service1", "service2", "service3"]);
    }));
});
