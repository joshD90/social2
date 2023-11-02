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
const createServiceController_1 = __importDefault(require("./createServiceController"));
const createFullServiceEntryMock = jest.fn();
const ServiceDBMock = { createFullServiceEntry: createFullServiceEntryMock };
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
describe("createServiceContoller test suite", () => {
    let sut = createServiceController_1.default;
    let req;
    let responseStatusMockSpy;
    let responseJsonMockSpy;
    beforeEach(() => {
        responseStatusMockSpy = jest.spyOn(responseMock, "status");
        responseJsonMockSpy = jest.spyOn(responseMock, "json");
        req = { body: {}, user: undefined };
    });
    afterEach(() => jest.clearAllMocks());
    it("should return res.status(401).json() if no req.user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut(req, responseMock);
        expect(responseStatusMockSpy).toBeCalledWith(401);
        expect(responseJsonMockSpy).toBeCalledWith("You are not Authorised to Create a Service. Must be an admin");
    }));
    it("should return res.status(401).json() if not admin", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "user" };
        yield sut(req, responseMock);
        expect(responseStatusMockSpy).toBeCalledWith(401);
        expect(responseJsonMockSpy).toBeCalledWith("You are not Authorised to Create a Service. Must be an admin");
    }));
    it("should call createFullServiceEntry with req.body information if user is present", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.body = { serviceBase: "serviceBase", subCategories: [] };
        const createFullServiceEntrySpy = jest.spyOn(ServiceDBMock, "createFullServiceEntry");
        createFullServiceEntryMock.mockResolvedValue({ insertId: 1 });
        yield sut(req, responseMock);
        expect(createFullServiceEntrySpy).toBeCalled();
        expect(createFullServiceEntrySpy).toBeCalledWith("serviceBase", []);
    }));
    it("should call res.status(500).json() if service isn't successfully saved", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        const responseSendMockSpy = jest.spyOn(responseMock, "send");
        createFullServiceEntryMock.mockResolvedValueOnce(Error("Some Error"));
        yield sut(req, responseMock);
        expect(responseStatusMockSpy).toBeCalledWith(500);
        expect(responseSendMockSpy).toBeCalledWith(`Could not create the service due to Some Error`);
    }));
    it("should send back the insertId if no issues creating service", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        createFullServiceEntryMock.mockResolvedValueOnce({ insertId: 1 });
        yield sut(req, responseMock);
        expect(responseStatusMockSpy).toBeCalledWith(201);
        expect(responseJsonMockSpy).toBeCalledWith({
            id: 1,
            message: `Service created with base service having an id of 1`,
        });
    }));
});
