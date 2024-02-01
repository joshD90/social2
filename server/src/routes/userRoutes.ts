import { Router } from "express";
import passport from "passport";
import updateUserPrivilegesController from "../controllers/userControllers/updateUserPrivileges/updateUserPrivilegesController";
import getUsersController from "../controllers/userControllers/getUsersController/getUsersController";
import { getAllUserOrganisationsController } from "../controllers/userControllers/getAllUserOrganisationsController/getAllUserOrganisationsController";
import getCommentsForUserController from "../controllers/commentControllers/getCommentsForUserController/getCommentsForUserController";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/", getUsersController);
router.get("/organisations", getAllUserOrganisationsController);
router.get("/comments/:userId", getCommentsForUserController);
router.put("/privileges", updateUserPrivilegesController);

export default router;
