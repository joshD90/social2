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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceReportDB = void 0;
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
const serviceReportQueries_1 = __importDefault(require("./serviceReportQueries"));
class ServiceReportDB {
    constructor(connection) {
        this.connection = connection;
        this.genericReportQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("serviceReports", connection);
        this.initDB();
    }
    initDB() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(serviceReportQueries_1.default.initTable);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createEntry(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEntry = yield this.genericReportQueries.createTableEntryFromPrimitives(data);
                if (newEntry instanceof Error)
                    throw Error();
                return newEntry;
            }
            catch (error) {
                return error;
            }
        });
    }
    getEntriesByService(serviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = typeof serviceId === "number" ? serviceId : parseInt(serviceId);
            if (isNaN(id))
                throw Error("serviceId must be a number or a string of a number");
            try {
                const result = yield this.genericReportQueries.findEntryBy("serviceId", id);
                if (result instanceof Error)
                    throw new Error(result.message);
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAllServiceReportEntries() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.genericReportQueries.findEntryBy();
                if (result instanceof Error)
                    throw new Error(result.message);
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    getSingleServiceReportEntry(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.genericReportQueries.findEntryBy("id", id);
                if (result instanceof Error)
                    throw Error("There was an error retrieving your data");
                if (result.length === 0)
                    throw Error("There were no records matching this id");
                const [firstResult] = result;
                return firstResult;
            }
            catch (error) {
                return error;
            }
        });
    }
    updateSingleReportStatus(reportId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(status === "accepted" ||
                status === "declined" ||
                status === "submitted" ||
                status === "under review"))
                return Error("Status value not in correct range");
            try {
                const [result] = yield this.connection.query(serviceReportQueries_1.default.updateRecordStatus, [status, reportId]);
                if (result.changedRows === 0)
                    throw Error("Unsuccessful update no changes made");
                return true;
            }
            catch (error) {
                console.log(error, "error in serviceReportStatusChange in db");
                return error;
            }
        });
    }
}
exports.ServiceReportDB = ServiceReportDB;
