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
exports.findAllCategories = void 0;
const server_1 = require("../../server");
const findAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield server_1.db.getCategoryDB().getCategoryQueries().findEntryBy();
        if (result instanceof Error)
            throw Error(result.message);
        const mappedResult = result.map((category) => (Object.assign(Object.assign({}, category), { name: category.categoryName })));
        res.status(200).json(mappedResult);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.findAllCategories = findAllCategories;
