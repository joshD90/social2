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
exports.DatabaseSearcher = void 0;
const databaseSearcherQueries_1 = __importDefault(require("./databaseSearcherQueries"));
class DatabaseSearcher {
    constructor(connection) {
        this.replicateKeyString = (searchParam) => {
            const modifiedSearchParam = `%${searchParam}%`;
            const replicateArray = [];
            for (let i = 0; i < 17; i++) {
                replicateArray.push(modifiedSearchParam);
            }
            return replicateArray;
        };
        this.connection = connection;
    }
    searchServices(keyString) {
        return __awaiter(this, void 0, void 0, function* () {
            const lowerCaseKey = keyString.toLowerCase();
            try {
                const result = yield this.connection.execute(databaseSearcherQueries_1.default.searchServicesQuery, this.replicateKeyString(lowerCaseKey));
                const data = result[0];
                if (data.length === 0)
                    return [];
                const weightedAndConcatonated = this.determineRelevantHeadersAndWeigh(data, lowerCaseKey);
                return weightedAndConcatonated.sort((a, b) => b.weight - a.weight);
            }
            catch (error) {
                return error;
            }
        });
    }
    //we weight and concatonate in the same function to avoid unnecessary overhead and to do more work while we are iterating
    determineRelevantHeadersAndWeigh(services, keyword) {
        const mappedSearched = services.map((service) => {
            //make it an iterable type
            const iterableService = Object.assign({}, service);
            const returnObj = {};
            let weight = 0;
            Object.entries(iterableService).forEach(([key, value]) => {
                if (!(typeof value === "string"))
                    return [key, value];
                const searchRangeValue = this.grabBeforeAndAfterSubStr(value, keyword, 50);
                if (!searchRangeValue)
                    return;
                returnObj[key] = searchRangeValue;
                weight += this.weighKey(key);
            });
            return {
                id: iterableService.id,
                name: iterableService.name,
                category: iterableService.category,
                forwardTo: iterableService.forwardTo,
                weight,
                matchingHeaders: Object.assign({}, returnObj),
            };
        });
        return mappedSearched;
    }
    grabBeforeAndAfterSubStr(stringToSlice, value, range) {
        const indexOfValue = stringToSlice
            .toLowerCase()
            .indexOf(value.toLowerCase());
        if (indexOfValue === -1)
            return undefined;
        const startIndex = indexOfValue - range < 0 ? 0 : indexOfValue - range;
        const endIndex = indexOfValue + value.length + range > stringToSlice.length - 1
            ? stringToSlice.length - 1
            : indexOfValue + range + value.length;
        const slicedString = stringToSlice.slice(startIndex, endIndex + 1);
        return `${startIndex > 0 ? "..." : ""}${slicedString}${endIndex < stringToSlice.length - 1 ? "..." : ""}`;
    }
    weighKey(key) {
        switch (key) {
            case "name":
                return 9;
            case "organisation":
                return 8;
            case "description":
                return 7;
            case "referralPathway":
                return 6;
            case "needs_met":
                return 5;
            case "client_groups":
                return 4;
            case "areas_served":
                return 3;
            case "minRequirementsToAccess":
                return 2;
            case "organisation":
                return 1;
            default:
                return 0;
        }
    }
}
exports.DatabaseSearcher = DatabaseSearcher;
