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
const updateServiceReportStatusController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges !== "admin")
        return res
            .status(403)
            .json("You do not have sufficient privileges to update this resource");
    const reportId = req.body.reportId;
    const status = req.body.reportStatus;
    if (!reportId || !status)
        return res
            .status(400)
            .json("Does not have the correct information in body");
    try {
        const updateResult = yield server_1.db
            .getServiceReportDB()
            .updateSingleReportStatus(reportId, status);
        if (updateResult instanceof Error)
            throw updateResult;
        res.status(200).json("Report status successfully updated");
    }
    catch (error) {
        if (!(error instanceof Error))
            return console.log(error);
        if (error.message === "Status value not in correct range")
            return res.status(400).json(error.message);
        res.status(500).json(error.message);
    }
});
exports.default = updateServiceReportStatusController;
