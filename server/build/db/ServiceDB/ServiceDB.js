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
exports.ServiceDB = void 0;
const serviceInitDBQueries_1 = require("./serviceInitDBQueries");
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
const SubCategoryDB_1 = require("./subCategoryDB/SubCategoryDB");
class ServiceDB {
    constructor(connection) {
        this.connection = connection;
        //queries for our Base information
        this.ServiceBaseQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("services", connection);
        //generate our subcategory db class
        this.SubCategoryDB = new SubCategoryDB_1.SubCategoryDB(connection);
        //generate our generic service report queries TODO: create a seperate report class for this
        this.serviceReportsQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("serviceReports", connection);
    }
    //create all our tables if they don't exist already
    initialiseServiceRelatedTables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //main tables
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createCategoriesTable);
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createServicesTable);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    //this compacts all the methods involved in creating the multiple tables associated with a service
    createFullServiceEntry(baseData, subCategories) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield this.connection.getConnection();
            yield connection.beginTransaction();
            try {
                //make our base table before proceeding
                const baseResult = yield this.ServiceBaseQueries.createTableEntryFromPrimitives(baseData);
                if (baseResult instanceof Error)
                    throw new Error("Could not make the base table for service");
                const serviceId = baseResult.insertId;
                // //now that we have made our base table entry we can create our sub directories
                const createSubCategoriesSuccess = yield this.SubCategoryDB.createAllSubCategories(serviceId, subCategories);
                if (!createSubCategoriesSuccess)
                    throw Error("Could not create sub categories");
                //commit all the changes if there are no errors
                yield connection.commit();
                return baseResult;
            }
            catch (error) {
                yield connection.rollback();
                return error;
            }
        });
    }
    //delete all documents related to a single serviceId
    deleteServiceAndRelatedEntries(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            //now we delete them in order - we must await the promises to avoid race conditions
            const connection = yield this.connection.getConnection();
            try {
                yield connection.beginTransaction();
                const deletedJunctionTables = yield this.SubCategoryDB.deleteJunctionTablesForService(serviceId);
                if (!deletedJunctionTables)
                    throw Error("Could Not Delete Junction Tables");
                const serviceReportDeleteTry = yield this.serviceReportsQueries.deleteBySingleCriteria("serviceId", serviceId);
                if (serviceReportDeleteTry instanceof Error &&
                    serviceReportDeleteTry.message !==
                        "There was no record matching that criteria")
                    throw Error(serviceReportDeleteTry.message);
                const deleteTry = yield this.ServiceBaseQueries.deleteBySingleCriteria("id", serviceId);
                if (deleteTry instanceof Error)
                    throw Error(deleteTry.message);
                yield connection.commit();
                return true;
            }
            catch (error) {
                yield connection.rollback();
                if (error instanceof Error &&
                    error.message === "There was no record matching that criteria")
                    return true;
                return error;
            }
        });
    }
    //fetch service and related sub categories
    fetchServiceAndRelatedEntries(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const baseService = yield this.ServiceBaseQueries.findEntryBy("id", serviceId);
                if (baseService instanceof Error)
                    return null;
                const allSubCategories = yield this.SubCategoryDB.fetchAllSubCategories(serviceId);
                if (allSubCategories instanceof Error)
                    throw Error("Error in fetching sub categories");
                return Object.assign({ baseService }, allSubCategories);
            }
            catch (error) {
                return error;
            }
        });
    }
    //basic getters and setters
    getBaseTableQueries() {
        return this.ServiceBaseQueries;
    }
    getSubCategoryDB() {
        return this.SubCategoryDB;
    }
    getBaseTableColumnNames() {
        this.ServiceBaseQueries.getTableColumnNames("services");
    }
}
exports.ServiceDB = ServiceDB;
