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
exports.findServicesByCategory = void 0;
const server_1 = require("../../server");
const findServicesByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category } = req.params;
    if (!category)
        return res
            .status(400)
            .json("You need to include a category as part of params");
    try {
        const result = yield server_1.db
            .getServiceDB()
            .getBaseTableQueries()
            .findEntryBy("category", category);
        if (result instanceof Error)
            throw Error(result.message);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findServicesByCategory = findServicesByCategory;
