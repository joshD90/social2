"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    db: {
        name: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        username: process.env.DB_USERNAME,
    },
    server: {
        port: process.env.PORT,
        clientServer: process.env.CLIENT_SERVER,
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
    },
};
