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
exports.findServiceByIdController = void 0;
const server_1 = require("../../server");
const findServiceByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceId = parseInt(req.params.serviceId);
    if (!serviceId)
        return res.status(400).json("Needs a serviceId");
    try {
        const serviceResult = yield server_1.db
            .getServiceDB()
            .fetchServiceAndRelatedEntries(serviceId);
        if (!serviceResult)
            return res.status(404).json("Could not find relevant entry");
        if (serviceResult instanceof Error)
            throw new Error(serviceResult.message);
        res.status(200).json(serviceResult);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.findServiceByIdController = findServiceByIdController;
