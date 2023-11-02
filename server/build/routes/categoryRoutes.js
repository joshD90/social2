"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const FindAllCategories_1 = require("../controllers/categoryControllers/FindAllCategories");
const router = express_1.default.Router();
router.get("/", FindAllCategories_1.findAllCategories);
exports.default = router;
