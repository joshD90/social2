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
exports.SubCategoryDB = void 0;
const GeneralQueryGenerator_1 = require("../../generalQueryGenerator/GeneralQueryGenerator");
const serviceInitDBQueries_1 = require("../serviceInitDBQueries");
const subServiceCategories_1 = require("../../../types/serviceTypes/subServiceCategories");
class SubCategoryDB {
    constructor(connection) {
        this.connection = connection;
        //Generic Query Class for Junction Tables
        this.needsMetJunctionQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("service_needs", connection);
        this.clientGroupsJunctionQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("service_clientGroups", connection);
        this.areasServedJunctionQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("service_areas", connection);
        //Generic Query Class for Sub Tables
        this.needsMetQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("needsMet", connection);
        this.clientGroupsQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("clientGroups", connection);
        this.areasServedQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("areasServed", connection);
        //generate correct strings for fetching sub tables
        this.subTableFetchQueries = this.createSubTableFetchQuery();
        //initialise
        this.initialiseSubCategoryTables();
    }
    initialiseSubCategoryTables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //sub tables
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createNeedsMetTable);
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createClientGroupTable);
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createAreaServedTable);
                //junction tables
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createServiceClientGroupJunction);
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createServiceAreaJunction);
                yield this.connection.query(serviceInitDBQueries_1.initServiceTablesQueries.createServiceNeedsJunction);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createAllSubCategories(serviceId, subCatArray) {
        return __awaiter(this, void 0, void 0, function* () {
            const successArray = yield Promise.all(subCatArray.map((category) => {
                const specificSubArray = this.generateSubTableVariables(category);
                return this.addFullSubCategory(specificSubArray, Object.values(category)[0], serviceId);
            }));
            if (successArray.some((el) => el === "failure")) {
                // this.deleteAllEntriesRelatedToService(serviceId);
                return false;
            }
            return true;
        });
    }
    fetchAllSubCategories(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [needsMet] = yield this.connection.execute(this.subTableFetchQueries.get("needsMet"), [serviceId]);
                const [clientGroups] = yield this.connection.execute(this.subTableFetchQueries.get("clientGroups"), [serviceId]);
                const [areasServed] = yield this.connection.execute(this.subTableFetchQueries.get("areasServed"), [serviceId]);
                return { needsMet, clientGroups, areasServed };
            }
            catch (error) {
                console.log(error);
                return Error(error.message);
            }
        });
    }
    //add all subCategory Entries within a specific type
    addFullSubCategory(specificTableVar, data, serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const successArray = yield Promise.all(data.map((entry) => {
                return this.addSubCategory(specificTableVar, entry, serviceId);
            }));
            if (successArray.some((el) => el === "failure"))
                return "failure";
            return "success";
        });
    }
    //create one subCategory Entry
    addSubCategory(specificTableVar, data, serviceId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const generalTableQuery = specificTableVar.tableQueries;
            const junctionTableQuery = specificTableVar.junctionTableQueries;
            const subTable = specificTableVar.tableName;
            const fieldName = specificTableVar.fieldName;
            //we need to change the format to fit the general table query.
            const formattedData = { [fieldName]: data.value };
            try {
                //see does this entry already exist
                const existingEntry = yield generalTableQuery.findEntryBy(specificTableVar.fieldName, data.value);
                let subId;
                //if it does use this id else create a new entry
                if (existingEntry instanceof Error) {
                    const result = yield generalTableQuery.createTableEntryFromPrimitives(formattedData);
                    if (result instanceof Error)
                        throw new Error("Could not create the Sub Directory");
                    subId = result.insertId;
                }
                else if ((_a = existingEntry[0]) === null || _a === void 0 ? void 0 : _a.id) {
                    subId = parseInt(existingEntry[0].id);
                }
                else {
                    throw Error(`Something Unexpected Happenend in checking whether sub category exists ${JSON.stringify(existingEntry)}`);
                }
                //take the id from the result and use this for the junction table
                //prepare our data
                const refColName = this.generateRefColNameJunc(subTable);
                const junctionData = {
                    service_id: serviceId,
                    [refColName]: subId,
                    exclusive: data.exclusive,
                };
                //insert into our junction table.
                const junctionResult = yield junctionTableQuery.createTableEntryFromPrimitives(junctionData);
                if (junctionResult instanceof Error) {
                    throw Error(junctionResult.message);
                }
                return "success";
            }
            catch (error) {
                console.log(error);
                return "failure";
            }
        });
    }
    //create the column name for the junction reference table
    generateRefColNameJunc(subTable) {
        switch (subTable) {
            case "needsMet":
                return "need_id";
            case "clientGroups":
                return "clientGroup_id";
            case "areasServed":
                return "area_id";
            default:
                throw Error("not of type SubServiceKey");
        }
    }
    //create the variables based on the type of subCategory we are trying to work with
    generateSubTableVariables(subCategory) {
        let tableQueries;
        let junctionTableQueries;
        let tableName;
        let fieldName;
        if (Object.keys(subCategory)[0] === "areasServed") {
            tableQueries = this.areasServedQueries;
            junctionTableQueries = this.areasServedJunctionQueries;
            tableName = subServiceCategories_1.SubServiceKey.AreasServed;
            fieldName = "area";
        }
        else if (Object.keys(subCategory)[0] === "clientGroups") {
            tableQueries = this.clientGroupsQueries;
            junctionTableQueries = this.clientGroupsJunctionQueries;
            tableName = subServiceCategories_1.SubServiceKey.ClientGroups;
            fieldName = "groupName";
        }
        else {
            tableQueries = this.needsMetQueries;
            junctionTableQueries = this.needsMetJunctionQueries;
            tableName = subServiceCategories_1.SubServiceKey.NeedsMet;
            fieldName = "need";
        }
        return { tableQueries, junctionTableQueries, tableName, fieldName };
    }
    createSubTableFetchQuery() {
        const queryMap = new Map();
        queryMap.set("needsMet", "SELECT need, exclusive FROM service_needs JOIN needsMet ON service_needs.need_id = needsMet.id WHERE service_id = ?;");
        queryMap.set("clientGroups", "SELECT groupName, exclusive FROM service_clientGroups JOIN clientGroups ON service_clientGroups.clientGroup_id = clientGroups.id WHERE service_id = ?");
        queryMap.set("areasServed", "SELECT area, exclusive FROM service_areas JOIN areasServed ON service_areas.area_id = areasServed.id WHERE service_id = ?");
        return queryMap;
    }
    //fetch all subCategory possibilities
    fetchAllSubCategoryEntries(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (tableName) {
                case "needsMet":
                    return yield this.needsMetQueries.findEntryBy();
                case "clientGroups":
                    return yield this.clientGroupsQueries.findEntryBy();
                case "areasServed":
                    return yield this.areasServedQueries.findEntryBy();
            }
        });
    }
    deleteJunctionTablesForService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const junctionTablesQuery = [
                this.areasServedJunctionQueries,
                this.clientGroupsJunctionQueries,
                this.needsMetJunctionQueries,
            ];
            try {
                yield Promise.all(junctionTablesQuery.map((tableQuery) => {
                    return tableQuery.deleteBySingleCriteria("service_id", serviceId);
                }));
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.SubCategoryDB = SubCategoryDB;
