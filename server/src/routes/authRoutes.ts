import { Router } from "express";
import authSignupController from "../controllers/authControllers/authSignupController";
import passport from "passport";
import authSignInController from "../controllers/authControllers/authSigninController";
import authSignOutController from "../controllers/authControllers/authSignOutController";
import userDataController from "../controllers/authControllers/userDataController";

const router = Router();

router.post("/signup", authSignupController);
router.post(
  "/signin",
  passport.authenticate("local", { session: false }),
  authSignInController
);
router.get("/signout", authSignOutController);
router.get(
  "/user-data",
  passport.authenticate("jwt", { session: false }),
  userDataController
);
export default router;
