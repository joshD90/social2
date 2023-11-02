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
//to update the service we completely delete all the records associated with a service and then add in the updated service rather than altering the existing records for the sake of simplicity
const updateServiceController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user || req.user.privileges !== "admin")
        return res
            .status(401)
            .json("You are not Authorised to Update a Service. Must be an admin");
    const serviceId = parseInt(req.params.serviceId);
    if (!serviceId)
        return res.status(400).json("Needs a Service Id in the form of a number");
    const { serviceBase, subCategories } = req.body;
    if (!serviceBase || !subCategories) {
        return res.status(400).json("Not in proper format");
    }
    //this will simply delete the full service record and insert the entire new one.  Decided this will be cleaner and less likely to result in errors
    try {
        //delete the junction tables so they can be refreshed before updating service base
        const deleteSubJunctionResult = yield server_1.db
            .getServiceDB()
            .getSubCategoryDB()
            .deleteJunctionTablesForService(serviceId);
        if (!deleteSubJunctionResult)
            throw Error("Could not successfully delete junction tables");
        //update our base table
        const updateServiceBaseResult = yield server_1.db
            .getServiceDB()
            .getBaseTableQueries()
            .updateEntriesByMultiple(serviceBase, serviceId, "id");
        if (updateServiceBaseResult instanceof Error)
            throw new Error(updateServiceBaseResult.message);
        //now we need to update the base service and not create the full service entry just create the junction tables
        const createResult = yield server_1.db
            .getServiceDB()
            .getSubCategoryDB()
            .createAllSubCategories(serviceId, subCategories);
        if (!createResult)
            throw Error("Service was deleted in preparation however an error occured when trying to add in updated version");
        res.status(200).json({ id: serviceId, message: "Successfully updated" });
    }
    catch (error) {
        res.status(500).json(error.message);
    }
});
exports.default = updateServiceController;
