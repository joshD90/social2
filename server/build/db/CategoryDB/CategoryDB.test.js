"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryDB_1 = require("./CategoryDB");
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
const mockPool = {};
jest.mock("../generalQueryGenerator/GeneralQueryGenerator");
describe("Test Suite for Category DB", () => {
    const sut = new CategoryDB_1.CategoryDB(mockPool);
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should return a GeneralQueryGenerator from the getter", () => {
        const actual = sut.getCategoryQueries();
        expect(actual).toBeInstanceOf(GeneralQueryGenerator_1.GeneralQueryGenerator);
    });
});
