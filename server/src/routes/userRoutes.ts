import { Router } from "express";
import passport from "passport";
import updateUserPrivilegesController from "../controllers/userControllers/updateUserPrivileges/updateUserPrivilegesController";
import getUsersController from "../controllers/userControllers/getUsersController/getUsersController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", getUsersController);
router.put("/privileges", updateUserPrivilegesController);

export default router;
