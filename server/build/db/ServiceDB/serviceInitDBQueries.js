"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initServiceTablesQueries = void 0;
//create our categories table.  This will be the parent of services
const createCategoriesTable = "CREATE TABLE IF NOT EXISTS categories(id INT AUTO_INCREMENT PRIMARY KEY, categoryName VARCHAR(255) NOT NULL UNIQUE, forwardTo VARCHAR(255) NOT NULL UNIQUE)";
//create our service attributes tables that will be joined later with junction tables for many to many
const createNeedsMetTable = "CREATE TABLE IF NOT EXISTS needsMet(id INT AUTO_INCREMENT PRIMARY KEY, need VARCHAR(255) NOT NULL UNIQUE)";
const createClientGroupTable = "CREATE TABLE IF NOT EXISTS clientGroups(id INT AUTO_INCREMENT PRIMARY KEY, groupName VARCHAR(255) NOT NULL UNIQUE)";
const createAreaServedTable = "CREATE TABLE IF NOT EXISTS areasServed(id INT AUTO_INCREMENT PRIMARY KEY, area VARCHAR(255) NOT NULL UNIQUE)";
//create our services table. We have created our categories first so we can reference this table first
const createServicesTable = "CREATE TABLE IF NOT EXISTS services (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, description VARCHAR(2000), category VARCHAR(255), organisation VARCHAR(255), maxAge INT, minAge INT, contactNumber VARCHAR(255), contactEmail VARCHAR(255), website VARCHAR(255), referralPathway VARCHAR(1000), address VARCHAR(500), imageUrl VARCHAR(255), forwardTo VARCHAR(255) UNIQUE NOT NULL, FOREIGN KEY (category) REFERENCES categories(forwardTo), maxCapacity INT, threshold VARCHAR(10), minRequirementsToAccess VARCHAR(1000))";
//set up our junction tables for our many to many relationships
const createServiceNeedsJunction = "CREATE TABLE IF NOT EXISTS service_needs(service_id INT NOT NULL, need_id INT NOT NULL, PRIMARY KEY (service_id, need_id), exclusive BOOL DEFAULT false, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE, FOREIGN KEY (need_id) REFERENCES needsMet(id) ON DELETE CASCADE)";
const createServiceClientGroupJunction = "CREATE TABLE IF NOT EXISTS service_clientGroups(service_id INT NOT NULL, clientGroup_id INT NOT NULL, PRIMARY KEY (service_id, clientGroup_id), exclusive BOOL DEFAULT false, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE, FOREIGN KEY (clientGroup_id) REFERENCES clientGroups(id) ON DELETE CASCADE)";
const createServiceAreaJunction = "CREATE TABLE IF NOT EXISTS service_areas(service_id INT NOT NULL, area_id INT NOT NULL, PRIMARY KEY (service_id, area_id),  exclusive BOOL DEFAULT false, FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE, FOREIGN KEY (area_id) REFERENCES areasServed(id) ON DELETE CASCADE)";
exports.initServiceTablesQueries = {
    createServicesTable,
    createCategoriesTable,
    createNeedsMetTable,
    createClientGroupTable,
    createAreaServedTable,
    createServiceNeedsJunction,
    createServiceClientGroupJunction,
    createServiceAreaJunction,
};
