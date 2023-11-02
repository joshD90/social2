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
const UserDB_1 = __importDefault(require("./UserDB"));
const mockExecute = jest.fn();
const mockQuery = jest.fn();
const connectionMock = {
    execute: mockExecute,
    query: mockQuery,
};
const createTableEntryFromPrimitivesMock = jest.fn();
const deleteBySingleCritriaMock = jest.fn();
const findEntryByMock = jest.fn();
const generalQueryMock = {
    createTableEntryFromPrimitives: createTableEntryFromPrimitivesMock,
    findEntryBy: findEntryByMock,
    deleteBySingleCriteria: deleteBySingleCritriaMock,
    deleteByTwoCriteria: jest.fn(),
    updateEntriesByMultiple: jest.fn(),
};
jest.mock("../generalQueryGenerator/GeneralQueryGenerator", () => ({
    GeneralQueryGenerator: jest.fn().mockImplementation(() => generalQueryMock),
}));
describe("test suite for userDB", () => {
    let sut;
    beforeEach(() => {
        sut = new UserDB_1.default(connectionMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should call the correct function for create new user and return correctly for creation and error", () => __awaiter(void 0, void 0, void 0, function* () {
        const createTableSpy = jest.spyOn(generalQueryMock, "createTableEntryFromPrimitives");
        createTableEntryFromPrimitivesMock.mockResolvedValueOnce("dummy return");
        let actual = yield sut.createNewUser({});
        expect(createTableSpy).toBeCalledTimes(1);
        expect(actual).toBe("dummy return");
        createTableEntryFromPrimitivesMock.mockResolvedValueOnce(new Error("Some Message"));
        actual = yield sut.createNewUser({});
        expect(actual).toBeInstanceOf(Error);
        expect(actual.message).toBe("Some Message");
    }));
    it("should call correct function when calling deleteUser and return correctly as well as error handle", () => __awaiter(void 0, void 0, void 0, function* () {
        const deleteQuerySpy = jest.spyOn(generalQueryMock, "deleteBySingleCriteria");
        deleteBySingleCritriaMock.mockResolvedValueOnce("deleted");
        let actual = yield sut.deleteUser(1);
        expect(deleteQuerySpy).toBeCalledTimes(1);
        expect(actual).toBe("deleted");
        deleteBySingleCritriaMock.mockResolvedValueOnce(new Error("error message"));
        actual = yield sut.deleteUser(1);
        expect(actual).toBeInstanceOf(Error);
        expect(actual.message).toBe("error message");
    }));
    it("should call correct function when calling findUser and return correctly or error throw", () => __awaiter(void 0, void 0, void 0, function* () {
        const findSpy = jest.spyOn(generalQueryMock, "findEntryBy");
        findEntryByMock.mockResolvedValueOnce("returned user");
        let actual = yield sut.findUser(["email", "someEmail"]);
        expect(findSpy).toHaveBeenCalledTimes(1);
        expect(actual).toBe("returned user");
        findEntryByMock.mockResolvedValueOnce(new Error("some error"));
        actual = yield sut.findUser(["email", "someEmail"]);
        expect(actual).toBeInstanceOf(Error);
        expect(actual.message).toBe("some error");
    }));
});
