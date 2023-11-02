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
const server_1 = require("../../server");
const getAllServicesController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allServices = yield server_1.db
            .getServiceDB()
            .getBaseTableQueries()
            .findEntryBy();
        if (allServices instanceof Error)
            throw Error("Issue with fetching services from DB");
        res.status(200).json(allServices);
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error)
            res.status(500).json(error.message);
    }
});
exports.default = getAllServicesController;
