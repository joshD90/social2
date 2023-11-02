"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const capitaliseFirstLetter_1 = __importDefault(require("./capitaliseFirstLetter"));
describe("capitalise first letter function test suite", () => {
    it("should capitalise the first letter and no others", () => {
        const sut = (0, capitaliseFirstLetter_1.default)("hello");
        expect(sut).toBe("Hello");
    });
    it("it should keep any non alphabetic numbers", () => {
        const sut = (0, capitaliseFirstLetter_1.default)("h3llo!");
        expect(sut).toBe("H3llo!");
    });
    it("should return an empty string when given an empty string", () => {
        const sut = (0, capitaliseFirstLetter_1.default)("");
        expect(sut).toBe("");
    });
});
