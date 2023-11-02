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
exports.findAllInSubCategory = void 0;
const server_1 = require("../../server");
const subServiceCategories_1 = require("../../types/serviceTypes/subServiceCategories");
const findAllInSubCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { subCategory } = req.params;
    let table;
    switch (subCategory) {
        case "needsMet":
            table = subServiceCategories_1.SubServiceKey.NeedsMet;
            break;
        case "clientGroups":
            table = subServiceCategories_1.SubServiceKey.ClientGroups;
            break;
        case "areasServed":
            table = subServiceCategories_1.SubServiceKey.AreasServed;
            break;
        default:
            return res.status(400).json("Wrong Table Name");
    }
    const result = yield server_1.db
        .getServiceDB()
        .getSubCategoryDB()
        .fetchAllSubCategoryEntries(table);
    if (result instanceof Error)
        return res.status(404).json("Could not Find Resources");
    res.status(200).json(result);
});
exports.findAllInSubCategory = findAllInSubCategory;
