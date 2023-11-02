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
exports.configurePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const server_1 = require("../server");
const envConfig_1 = __importDefault(require("../env/envConfig"));
const configurePassport = (app) => {
    //our local strategy for initial log
    passport_1.default.use(new passport_local_1.Strategy(
    //just to ensure that we are referencing the correct field
    { usernameField: "email" }, 
    //our verify callback function
    (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            //find out user in db
            const userFound = yield server_1.db.getUserDB().findUser(["email", email]);
            //if we cant find the user or the user does not have a password return error
            if (userFound instanceof Error ||
                !userFound[0] ||
                !userFound[0].password)
                return done(null, false);
            //check is password correct
            const passwordMatches = yield bcrypt_1.default.compare(password, userFound[0].password);
            if (!passwordMatches)
                return done(null, false);
            //delete sensitive data before returning object
            delete userFound[0].password;
            console.log(userFound[0]);
            return done(null, userFound[0]);
        }
        catch (error) {
            console.log(error);
            return done(error);
        }
    })));
    //set up our JWT Strategy
    passport_1.default.use(new passport_jwt_1.Strategy({
        jwtFromRequest: cookieExtractor,
        secretOrKey: envConfig_1.default.auth.jwtSecret,
    }, (payload, done) => {
        try {
            done(null, payload);
        }
        catch (error) {
            done(error);
        }
    }));
    //once we have configured out strategies we set initialise them
    app.use(passport_1.default.initialize());
};
exports.configurePassport = configurePassport;
//this is the functiont that is plugged into JWTFromRequest config options
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies["jwt"];
    }
    return token;
};
