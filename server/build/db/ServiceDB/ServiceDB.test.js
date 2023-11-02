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
const ServiceDB_1 = require("./ServiceDB");
//mocks
const mockExecute = jest.fn();
const mockQuery = jest.fn();
const beginTransactionMock = jest.fn();
const commitMock = jest.fn();
const rollbackMock = jest.fn();
const getConnectionReturn = {
    execute: mockExecute,
    query: mockQuery,
    beginTransaction: beginTransactionMock,
    commit: commitMock,
    rollback: rollbackMock,
};
const connectionMock = Object.assign(Object.assign({}, getConnectionReturn), { getConnection: jest.fn().mockImplementation(() => getConnectionReturn) });
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
describe("ServiceDB test suite", () => {
    let sut;
    beforeEach(() => {
        sut = new ServiceDB_1.ServiceDB(connectionMock);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe("Init Service Tables test suite", () => {
        it("should test to see that the necessary calls have occurred for setting up the table", () => __awaiter(void 0, void 0, void 0, function* () {
            const querySpy = jest.spyOn(getConnectionReturn, "query");
            yield sut.initialiseServiceRelatedTables();
            expect(querySpy).toBeCalledTimes(8);
        }));
    });
    describe("Create Full Service Entry test suite", () => {
        it("should call beginTransaction", () => __awaiter(void 0, void 0, void 0, function* () {
            const beginTransactionSpy = jest.spyOn(getConnectionReturn, "beginTransaction");
            yield sut.createFullServiceEntry({}, []);
            expect(beginTransactionSpy).toBeCalledTimes(1);
        }));
        it("should call createTableEntryFromPrimitives with first parameter", () => __awaiter(void 0, void 0, void 0, function* () {
            const createEntrySpy = jest.spyOn(generalQueryMock, "createTableEntryFromPrimitives");
            yield sut.createFullServiceEntry({ foo: "bar" }, []);
            expect(createEntrySpy).toBeCalledTimes(1);
            expect(createEntrySpy).toBeCalledWith({ foo: "bar" });
        }));
        it("should return an Error and Rollback if createTableEntryFromPrimitives returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
            const rollbackSpy = jest.spyOn(connectionMock, "rollback");
            createTableEntryFromPrimitivesMock.mockResolvedValueOnce(new Error());
            const actual = yield sut.createFullServiceEntry({}, []);
            expect(actual).toBeInstanceOf(Error);
            expect(actual.message).toBe("Could not make the base table for service");
            expect(rollbackSpy).toBeCalled();
        }));
        it("should call addFullSubCategory when mapping subCategories", () => __awaiter(void 0, void 0, void 0, function* () {
            const addFullSubCategorySpy = jest.spyOn(sut, "addFullSubCategory");
            createTableEntryFromPrimitivesMock.mockResolvedValueOnce({ insertId: 1 });
            const subServiceCategory = { value: "something", exclusive: true };
            yield sut.createFullServiceEntry({}, [
                { areasServed: [subServiceCategory] },
            ]);
            expect(addFullSubCategorySpy).toHaveBeenCalled();
        }));
        it("should return an error if the successArray contains failure", () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(sut, "addFullSubCategory").mockResolvedValueOnce("failure");
            const connectionRollbackSpy = jest.spyOn(connectionMock, "rollback");
            createTableEntryFromPrimitivesMock.mockResolvedValueOnce({ insertId: 1 });
            const subServiceCategory = { value: "something", exclusive: true };
            const actual = yield sut.createFullServiceEntry({}, [
                { areasServed: [subServiceCategory] },
            ]);
            expect(actual).toBeInstanceOf(Error);
            expect(connectionRollbackSpy).toBeCalled();
        }));
        it("should call connection.commit and return the baseResult if successArray is successful", () => __awaiter(void 0, void 0, void 0, function* () {
            const commitSpy = jest.spyOn(connectionMock, "commit");
            jest.spyOn(sut, "addFullSubCategory").mockResolvedValueOnce("success");
            createTableEntryFromPrimitivesMock.mockResolvedValueOnce({ insertId: 1 });
            const subServiceCategory = { value: "something", exclusive: true };
            const actual = yield sut.createFullServiceEntry({}, [
                { areasServed: [subServiceCategory] },
            ]);
            expect(commitSpy).toBeCalledTimes(1);
            expect(actual).toEqual({ insertId: 1 });
        }));
    });
    describe("AddFullSubCategory Test Suite", () => {
        const subServiceItem = { value: "string", exclusive: true };
        it("should return success if all addSubCategory functions return success", () => __awaiter(void 0, void 0, void 0, function* () {
            const addSubCategoriesSpy = jest
                .spyOn(sut, "addSubCategory")
                .mockResolvedValueOnce("success")
                .mockResolvedValueOnce("success");
            const actual = yield sut.addFullSubCategory({}, [subServiceItem, subServiceItem], 1);
            expect(addSubCategoriesSpy).toBeCalledTimes(2);
            expect(actual).toBe("success");
        }));
    });
    describe("test suite for addSubCategory", () => {
        let findEntryBySpy;
        let createTableEntrySpy;
        const dummyParams = [
            {
                tableQueries: generalQueryMock,
                tableName: "needsMet",
                junctionTableQueries: generalQueryMock,
            },
            { value: "string", exclusive: false },
            1,
        ];
        beforeEach(() => {
            findEntryBySpy = jest.spyOn(generalQueryMock, "findEntryBy");
            createTableEntrySpy = jest.spyOn(generalQueryMock, "createTableEntryFromPrimitives");
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it("should call createTableFromPrimitives if findEntryBy returns Error", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryBySpy.mockResolvedValueOnce(Error());
            yield sut.addSubCategory(...dummyParams);
            expect(createTableEntrySpy).toBeCalled();
        }));
        it("should throw an error if findEntryBy does not return an error or id", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryBySpy.mockResolvedValueOnce("something random");
            const actual = yield sut.addSubCategory(...dummyParams);
            expect(actual).toBe("failure");
        }));
        it("should continue by calling createTableEntry if successful", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryBySpy.mockResolvedValueOnce(Error());
            createTableEntrySpy
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce([{ insertId: 1 }]);
            const actual = yield sut.addSubCategory(...dummyParams);
            expect(createTableEntrySpy).toBeCalledTimes(2);
            expect(actual).toBe("success");
        }));
        it("should return failure if the final createTableEntry returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryByMock.mockResolvedValueOnce(Error());
            createTableEntrySpy
                .mockResolvedValueOnce([{ insertId: 1 }])
                .mockResolvedValueOnce(Error());
            const actual = yield sut.addSubCategory(...dummyParams);
            expect(actual).toBe("failure");
        }));
    });
    describe("test suite for deleteServiceAndRelatedEntry", () => {
        it("should call deleteBySingleCriteria 4x times over the course of the deletion", () => __awaiter(void 0, void 0, void 0, function* () {
            const deleteBySingleCriteriaSpy = jest.spyOn(generalQueryMock, "deleteBySingleCriteria");
            deleteBySingleCritriaMock.mockResolvedValue(1);
            const actual = yield sut.deleteServiceAndRelatedEntries(1);
            expect(deleteBySingleCriteriaSpy).toBeCalledTimes(4);
            expect(actual).toBe(true);
        }));
        it.todo("should Error if deleteBySingleCriteriaReturns an Error"
        // async () => {
        //need to change the actual sut to return an error properly.
        // deleteBySingleCritriaMock.mockResolvedValueOnce(Error());
        // const actual = await sut.deleteServiceAndRelatedEntries(1);
        // expect(actual).toBeInstanceOf(Error);
        // }
        );
    });
    describe("test suite for fetchServiceAndRelatedEntries", () => {
        test("it should return null when findEntryBy returns an error", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryByMock.mockResolvedValueOnce(Error());
            const actual = yield sut.fetchServiceAndRelatedEntries(1);
            expect(actual).toBeNull();
        }));
        test("it should call connection.execute 3x times if baseService is found", () => __awaiter(void 0, void 0, void 0, function* () {
            findEntryByMock.mockResolvedValueOnce(1);
            const executeSpy = jest.spyOn(connectionMock, "execute");
            mockExecute
                .mockResolvedValueOnce([1])
                .mockResolvedValueOnce([2])
                .mockResolvedValueOnce([3]);
            const actual = yield sut.fetchServiceAndRelatedEntries(1);
            expect(executeSpy).toBeCalledTimes(3);
            expect(actual).toEqual({
                baseService: 1,
                needsMet: 1,
                areasServed: 3,
                clientGroups: 2,
            });
        }));
    });
});
