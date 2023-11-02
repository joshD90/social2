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
const deleteServiceByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges !== "admin")
        return res
            .status(401)
            .json("You are not Authorised to Delete a Service. Must be an admin");
    const serviceId = parseInt(req.params.serviceId);
    if (Number.isNaN(serviceId))
        return res.status(400).json("Service Id Provided is not a number");
    try {
        const result = yield server_1.db
            .getServiceDB()
            .deleteServiceAndRelatedEntries(serviceId);
        //if unsuccessful
        if (result instanceof Error)
            throw Error("There was an error in deleting this record");
        //otherwise return deleted
        return res.status(204).json("deleted");
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json(error.message);
        return res.status(500).json({ error: error });
    }
});
exports.default = deleteServiceByIdController;
