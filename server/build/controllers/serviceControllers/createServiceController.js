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
const createServiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges !== "admin")
        return res
            .status(401)
            .json("You are not Authorised to Create a Service. Must be an admin");
    //set up
    const serviceDB = server_1.db.getServiceDB();
    const serviceBase = req.body.serviceBase;
    const subCatergories = req.body.subCategories;
    //create database entry
    const result = yield serviceDB.createFullServiceEntry(serviceBase, subCatergories);
    if (result instanceof Error)
        return res
            .status(500)
            .send(`Could not create the service due to ${result.message}`);
    res.status(201).json({
        id: result.insertId,
        message: `Service created with base service having an id of ${result.insertId}`,
    });
});
exports.default = createServiceController;
