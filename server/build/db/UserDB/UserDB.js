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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
const userTableQueries_1 = __importDefault(require("./userTableQueries"));
class UserDB {
    constructor(connection) {
        this.connection = connection;
        this.userQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("users", connection);
        this.organisationQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("organisations", connection);
        this.initialiseUserTable();
    }
    initialiseUserTable() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(userTableQueries_1.default.initUserTable);
                yield this.connection.query(userTableQueries_1.default.initOrganisationTable);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    createNewUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const organisationResult = yield this.organisationQueries.findEntryBy("name", userInfo.organisation);
                if (organisationResult instanceof Error ||
                    organisationResult.length === 0)
                    throw Error("No organisation in the database matched this query");
                userInfo.organisation = organisationResult[0].id;
                const result = yield this.userQueries.createTableEntryFromPrimitives(userInfo);
                if (result instanceof Error)
                    throw new Error(result.message);
                return result;
            }
            catch (error) {
                return Error(error.message);
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userQueries.deleteBySingleCriteria("id", userId);
                if (result instanceof Error)
                    throw new Error(result.message);
                return result;
            }
            catch (error) {
                return Error(error.message);
            }
        });
    }
    findUser(criteria) {
        return __awaiter(this, void 0, void 0, function* () {
            if (criteria[0] !== "users.id" &&
                criteria[0] !== "email" &&
                criteria[0] !== "organisation")
                throw new Error("Wrong  Crtieria");
            const query = userTableQueries_1.default.generateFindUserQuery(criteria[0]);
            try {
                const [result] = yield this.connection.query(query, criteria[1]);
                if (result.length === 0)
                    return [];
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.connection.query(userTableQueries_1.default.findAllUsers);
                const usersWithoutPasswords = result.map((user) => {
                    const { password } = user, rest = __rest(user, ["password"]);
                    return rest;
                });
                return usersWithoutPasswords;
            }
            catch (error) {
                return error;
            }
        });
    }
    updatePrivileges(privilege, id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(privilege === "none" || privilege === "approved"))
                throw Error("Only none and approved privileges can be granted at this endpoint");
            try {
                const [result] = yield this.connection.query(userTableQueries_1.default.updatePrivileges, [privilege, id]);
                if (result.affectedRows === 0)
                    throw Error("No Affected Rows");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    getAllOrganisations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const [result] = yield this.connection.query(userTableQueries_1.default.getAllOrganisationsNames);
                console.log(result, "organisation names");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
}
exports.default = UserDB;
