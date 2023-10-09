import { Router } from "express";
import passport from "passport";
import updateUserPrivilegesController from "../controllers/userControllers/updateUserPrivileges/updateUserPrivilegesController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.put("/privileges", updateUserPrivilegesController);
