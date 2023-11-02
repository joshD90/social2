"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./Database"));
const poolPromiseMock = {
    promise: jest.fn(() => ({ query: jest.fn() })),
};
//module returns a object directly rather than a constructor
jest.mock("mysql2", () => ({
    createPool: jest.fn(() => poolPromiseMock), // Attach the createPool mock here
}));
describe("Database class test suite", () => {
    let sut;
    beforeEach(() => {
        sut = new Database_1.default();
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("should test that it creates a connection successfully", () => {
        const poolPromiseSpy = jest.spyOn(poolPromiseMock, "promise");
        expect(sut.getConnection()).toBeTruthy();
        expect(poolPromiseSpy).toHaveBeenCalled();
    });
});
