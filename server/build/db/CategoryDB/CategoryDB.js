"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDB = void 0;
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
class CategoryDB {
    constructor(connection) {
        this.connection = connection;
        this.categoryQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("categories", connection);
    }
    getCategoryQueries() {
        return this.categoryQueries;
    }
}
exports.CategoryDB = CategoryDB;
