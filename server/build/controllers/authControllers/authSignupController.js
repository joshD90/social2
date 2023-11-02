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
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../../server");
const authSignupController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, firstName, lastName, password, organisation, passwordConfirm, } = req.body;
    if (!email ||
        !firstName ||
        !lastName ||
        !password ||
        !passwordConfirm ||
        !organisation)
        return res.status(400).json("Missing some key information");
    if (password !== passwordConfirm)
        return res.status(400).json("Passwords dont match");
    if (!checkDomainCorrect(email, organisation))
        return res
            .status(400)
            .json("The organisation does not match your email, please use your work email as an identifier");
    try {
        const hashedPW = yield bcrypt_1.default.hash(password, 10);
        const user = {
            email,
            firstName,
            lastName,
            password: hashedPW,
            organisation,
            privileges: "none",
        };
        const result = yield server_1.db.getUserDB().createNewUser(user);
        if (result instanceof Error)
            throw Error("Issue with creating the entry");
        res
            .status(201)
            .json(`New user was created with the id of ${result.insertId}`);
    }
    catch (error) {
        if (error instanceof Error)
            return res.status(500).json("There was an error in creating the user");
        res.status(500).json(error);
    }
});
const checkDomainCorrect = (email, organisation) => {
    if (!email.includes(organisation))
        return false;
    const indexofAt = email.indexOf("@");
    const afterAt = email.slice(indexofAt + 1).toLowerCase();
    const domain = afterAt.slice(0, afterAt.indexOf("."));
    if (domain !== organisation.toLowerCase())
        return false;
    return true;
};
exports.default = authSignupController;
