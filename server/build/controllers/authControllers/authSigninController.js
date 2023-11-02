"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envConfig_1 = __importDefault(require("../../env/envConfig"));
const authSignInController = (req, res) => {
    if (!req.user)
        return res
            .status(401)
            .json("There was an issue with verifying your credentials");
    const user = req.user;
    try {
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            id: user.id,
            privileges: user.privileges,
            firstName: user.firstName,
            lastName: user.lastName,
            organisation: user.organisation,
        }, envConfig_1.default.auth.jwtSecret, { expiresIn: "1d" });
        return res
            .cookie("jwt", token, { httpOnly: true, secure: false })
            .status(200)
            .json(user);
    }
    catch (error) {
        return res.status(401).json({ message: "There was an error loggin in" });
    }
};
exports.default = authSignInController;
