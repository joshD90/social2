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
//this is the controller for the endpoint for when we refresh the page.  The authcontext first looks here and will pass the cookie to our middleware and it will retrieve the user to set in its context from this endpoint
const userDataController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.user)
        return res.status(401).json("Your Credentials are Invalid");
    //to manage this statelessly we can simply return the deserialised cookie information as we can confirm that this is authenticated due to the JWT signing
    const user = req.user;
    res.status(200).json(user);
});
exports.default = userDataController;
