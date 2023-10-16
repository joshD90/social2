import { Router } from "express";
import passport from "passport";
import updateUserPrivilegesController from "../controllers/userControllers/updateUserPrivileges/updateUserPrivilegesController";
import getUsersController from "../controllers/userControllers/getUsersController/getUsersController";
import { getAllUserOrganisationsController } from "../controllers/userControllers/getAllUserOrganisationsController/getAllUserOrganisationsController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", getUsersController);
router.get("/organisations", getAllUserOrganisationsController);
router.put("/privileges", updateUserPrivilegesController);

export default router;
