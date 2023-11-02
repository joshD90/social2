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
const findAllInSubCategory_1 = require("./findAllInSubCategory");
const fetchAllSubCategoryEntriesMock = jest.fn();
const ServiceDBMock = {
    fetchAllSubCategoryEntries: fetchAllSubCategoryEntriesMock,
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
describe("findAllInSubCategory test suite", () => {
    let req;
    let statusSpy;
    let jsonSpy;
    let sendSpy;
    let sut;
    beforeEach(() => {
        req = {};
        statusSpy = jest.spyOn(responseMock, "status");
        jsonSpy = jest.spyOn(responseMock, "json");
        sendSpy = jest.spyOn(responseMock, "send");
        sut = findAllInSubCategory_1.findAllInSubCategory;
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should return res.status(400).json() if the req.params does not match table name", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { subCategory: "someTable" };
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(400);
        expect(jsonSpy).toBeCalledWith("Wrong Table Name");
    }));
    it("should call fetchAllSubCategoryEntries with correct table name", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { subCategory: "areasServed" };
        yield sut(req, responseMock);
        expect(fetchAllSubCategoryEntriesMock).toBeCalledWith("areasServed");
    }));
    it("should return res.status(404).json()", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { subCategory: "areasServed" };
        fetchAllSubCategoryEntriesMock.mockResolvedValueOnce(Error());
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(404);
        expect(jsonSpy).toBeCalledWith("Could not Find Resources");
    }));
    it("should respond with status(200) and result if no issues", () => __awaiter(void 0, void 0, void 0, function* () {
        req.params = { subCategory: "needsMet" };
        fetchAllSubCategoryEntriesMock.mockResolvedValueOnce({
            someValue: "value",
        });
        yield sut(req, responseMock);
        expect(statusSpy).toBeCalledWith(200);
        expect(jsonSpy).toBeCalledWith({ someValue: "value" });
    }));
});
