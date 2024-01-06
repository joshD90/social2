import { Router } from "express";
import authSignupController from "../controllers/authControllers/authSignupController";
import passport from "passport";
import authSignInController from "../controllers/authControllers/authSigninController";
import authSignOutController from "../controllers/authControllers/authSignOutController";
import userDataController from "../controllers/authControllers/userDataController";
import checkEmailKeyController from "../controllers/authControllers/emailConfirm/checkEmailKeyController/checkEmailKeyController";
import resendEmailController from "../controllers/authControllers/emailConfirm/resendEmailController/resendEmailController";

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
router.get("/compare-mail-check", checkEmailKeyController);
router.get("/mail-key-resend", resendEmailController);
export default router;
