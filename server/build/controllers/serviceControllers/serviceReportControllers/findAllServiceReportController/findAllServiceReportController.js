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
const server_1 = require("../../../../server");
const findAllServiceReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user ||
        !req.user.privileges ||
        req.user.privileges !== "admin")
        return res
            .status(403)
            .json("You do not have sufficient privileges to access this endpoint");
    let result;
    if (req.query.serviceId) {
        //get all the reports for a particular service if the query param is there
        const serviceId = parseInt(req.query.serviceId);
        console.log(serviceId);
        if (isNaN(serviceId))
            return res
                .status(400)
                .json("serviceId query param should be of type int for this table");
        result = yield server_1.db.getServiceReportDB().getEntriesByService(serviceId);
    }
    else {
        //get all the reports in the table
        result = yield server_1.db.getServiceReportDB().getAllServiceReportEntries();
    }
    if (result instanceof Error)
        return res.status(500).json("There was an error searching the database");
    if (result.length === 0)
        res.status(404).json("No Entries found");
    res.status(200).json(result);
});
exports.default = findAllServiceReportController;
