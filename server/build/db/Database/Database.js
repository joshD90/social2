"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const envConfig_1 = __importDefault(require("../../env/envConfig"));
const mysql2_1 = __importDefault(require("mysql2"));
const ServiceDB_1 = require("../ServiceDB/ServiceDB");
const CategoryDB_1 = require("../CategoryDB/CategoryDB");
const UserDB_1 = __importDefault(require("../UserDB/UserDB"));
const ServiceReportDB_1 = require("../ServiceReportDB/ServiceReportDB");
const DatabaseSearcher_1 = require("../../search/DatabaseSearcher/DatabaseSearcher");
const CommentsDB_1 = require("../CommentsDB/CommentsDB");
const { db } = envConfig_1.default;
//our overarching database class
class Database {
    constructor() {
        this.connection = this.initDatabase();
        this.serviceDB = new ServiceDB_1.ServiceDB(this.connection);
        this.serviceDB.initialiseServiceRelatedTables();
        this.categoryDB = new CategoryDB_1.CategoryDB(this.connection);
        this.userDB = new UserDB_1.default(this.connection);
        this.serviceReportDB = new ServiceReportDB_1.ServiceReportDB(this.connection);
        this.databaseSearcher = new DatabaseSearcher_1.DatabaseSearcher(this.connection);
        this.commentsDB = new CommentsDB_1.CommentsDB(this.connection);
    }
    //connection initialises within the constructor of the database
    initDatabase() {
        //settings for the connection
        const pool = mysql2_1.default.createPool({
            host: db.host,
            user: db.username,
            database: db.name,
            password: db.password,
            connectionLimit: 10,
            waitForConnections: true,
            decimalNumbers: true,
        });
        //setting up pool to accept async await
        const connection = pool.promise();
        return connection;
    }
    //getters
    getConnection() {
        return this.connection;
    }
    getServiceDB() {
        return this.serviceDB;
    }
    getCategoryDB() {
        return this.categoryDB;
    }
    getUserDB() {
        return this.userDB;
    }
    getServiceReportDB() {
        return this.serviceReportDB;
    }
    getSearcher() {
        return this.databaseSearcher;
    }
    getCommentsDB() {
        return this.commentsDB;
    }
}
exports.default = Database;
