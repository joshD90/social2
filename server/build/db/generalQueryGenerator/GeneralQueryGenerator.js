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
exports.GeneralQueryGenerator = void 0;
class GeneralQueryGenerator {
    constructor(table, connection) {
        this.table = table;
        this.connection = connection;
    }
    //will only work with object<string, string>
    createTableEntryFromPrimitives(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const values = Object.values(data);
            const keys = Object.keys(data);
            //create a dynamic query through concatonation of our keys and values
            const query = `INSERT INTO ${this.table} (${keys.join(", ")}) VALUES(${values.map(() => "?").join(", ")})`;
            try {
                const [rows] = yield this.connection.execute(query, values);
                if (!rows)
                    throw new Error("Could Not Create New Entry");
                return rows;
            }
            catch (error) {
                return error;
            }
        });
    }
    //find entries of a table by either getting all of them or by specifying a column value
    findEntryBy(column, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const additionalSearchInfo = column && data ? `WHERE ${column} = ?` : "";
            const query = `SELECT * FROM ${this.table} ${additionalSearchInfo}`;
            try {
                const [result] = yield this.connection.execute(query, data ? [data] : null);
                if (!result || result.length === 0)
                    throw new Error("Could not find any Entries matching this criteria");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    //works where the column value either a string or a number and 1 col Primary Key
    deleteBySingleCriteria(column, value) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM ${this.table} WHERE ${column} = ?`;
            try {
                const dataBack = yield this.connection.execute(query, [
                    value,
                ]);
                const [result] = dataBack;
                if (result.affectedRows === 0)
                    throw Error("There was no record matching that criteria");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    //for two column primary keys
    //works where the column value either a string or a number and 1 col Primary Key
    deleteByTwoCriteria(columns, values) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `DELETE FROM ${this.table} WHERE ${columns[0]} = ? AND ${columns[1]} = ?`;
            try {
                const [result] = yield this.connection.execute(query, [
                    values,
                ]);
                if (result.affectedRows === 0)
                    throw Error("There was no record matching that criteria");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    //update table by column and values - works when values are strings
    updateEntriesByMultiple(updateObject, identifierValue, identifierColumn) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = Object.keys(updateObject);
            const values = Object.values(updateObject);
            const columnWhiteList = yield this.getTableColumnNames(this.table);
            //sanitize data
            try {
                keys.forEach((column) => {
                    if (!columnWhiteList.includes(column)) {
                        throw new Error("Column name does not match approved list");
                    }
                });
            }
            catch (error) {
                return error;
            }
            const keysInQuery = keys.map((key) => `${key} = ?`).join(", ");
            //identifier column for where fieldName = "someValue" <-identifier value so we dont update the whole table
            const query = `UPDATE ${this.table} SET ${keysInQuery} WHERE ${identifierColumn} = ?`;
            try {
                const dataBack = yield this.connection.execute(query, [
                    ...values,
                    identifierValue,
                ]);
                const [result] = dataBack;
                if (!result || result.affectedRows === 0)
                    throw new Error("Could not update this entry");
                return result;
            }
            catch (error) {
                return error;
            }
        });
    }
    getTableName() {
        return this.table;
    }
    getTableColumnNames(tableName) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?`;
            try {
                const result = yield this.connection.execute(query, [
                    tableName,
                ]);
                const [onlyColumns] = result;
                const columnNameArray = onlyColumns.map((row) => row.COLUMN_NAME);
                return columnNameArray;
            }
            catch (error) {
                return Error(error.message);
            }
        });
    }
}
exports.GeneralQueryGenerator = GeneralQueryGenerator;
