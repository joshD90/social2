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
const updateServiceController_1 = __importDefault(require("./updateServiceController"));
const deleteServiceAndRelatedEntriesMock = jest.fn();
const createFullServiceEntryMock = jest.fn();
jest.mock("../../server", () => ({
    db: {
        getServiceDB: () => ({
            deleteServiceAndRelatedEntries: deleteServiceAndRelatedEntriesMock,
            createFullServiceEntry: createFullServiceEntryMock,
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
        req = { params: {}, body: {} };
        sut = updateServiceController_1.default;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should res.status(401) if no req.user", () => __awaiter(void 0, void 0, void 0, function* () {
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(401);
        expect(jsonSpy).toBeCalledWith("You are not Authorised to Update a Service. Must be an admin");
    }));
    it("should res.status(401) if user is not admin", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "user" };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(401);
        expect(jsonSpy).toBeCalledWith("You are not Authorised to Update a Service. Must be an admin");
    }));
    it("should res.status(400) if no serviceId or serviceId is NaN", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        //undefined
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Needs a Service Id in the form of a number");
        req.params = { serviceId: "a" };
        //NaN
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Needs a Service Id in the form of a number");
    }));
    it("should res.status(400) if serviceBase and subCategories are not included in body", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: undefined, serviceBase: undefined };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Not in proper format");
        //one undefined
        req.body = { subCategories: "something", serviceBase: undefined };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Not in proper format");
        //other one undefined
        req.body = { subCategories: undefined, serviceBase: "something" };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Not in proper format");
    }));
    it("should call deleteServiceAndRelatedEntries if all previous criteria has been met", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: "something", serviceBase: "something" };
        yield sut(req, responseMock);
        expect(deleteServiceAndRelatedEntriesMock).toBeCalledWith(1);
    }));
    it("should res.status(500) if deleteServiceAndRelatedEntries returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: "something", serviceBase: "something" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(Error("some error"));
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith("Could not successfully delete Service Record");
    }));
    it("should call createFullServiceEntry with params from req.body if deletedSuccessfully", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: "somethingElse", serviceBase: "something" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
        yield sut(req, responseMock);
        expect(createFullServiceEntryMock).toBeCalledWith("something", "somethingElse");
    }));
    it("should res.status(500) if service is not created properly", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: "somethingElse", serviceBase: "something" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
        createFullServiceEntryMock.mockResolvedValueOnce(Error("some error"));
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(500);
        expect(jsonSpy).toBeCalledWith("Service was deleted in preparation however an error occured when trying to add in updated version");
    }));
    it("should res.status(200) with appropriate json object if all is successful", () => __awaiter(void 0, void 0, void 0, function* () {
        req.user = { privileges: "admin" };
        req.params = { serviceId: "1" };
        req.body = { subCategories: "somethingElse", serviceBase: "something" };
        deleteServiceAndRelatedEntriesMock.mockResolvedValueOnce(true);
        createFullServiceEntryMock.mockResolvedValueOnce({ insertId: 3 });
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith({ id: 3, message: "Successfully updated" });
    }));
});
