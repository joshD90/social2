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
const createServiceReportController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.email === "guest@guest.com")
        return res.status(401).json("You must be signed in to generate a report");
    if (!req.body.data || !req.body.user || !req.body.serviceId)
        return res.status(400).json("Missing Some Key Information");
    const { data, user, serviceId } = req.body;
    if (!(typeof data.inaccuracyDesc === "string") || !user.id)
        return res.status(400).json("Missing some user id or issue description");
    try {
        const createdEntry = yield server_1.db.getServiceReportDB().createEntry({
            userId: user.id,
            report: data.inaccuracyDesc,
            serviceId: serviceId,
        });
        if (createdEntry instanceof Error)
            throw new Error("There was an issue in creating this entry");
        return res
            .status(201)
            .json(`You have successfully submitted a report with id of ${createdEntry.insertId}`);
    }
    catch (error) {
        return res.status(500).json(error.message);
    }
});
exports.default = createServiceReportController;
