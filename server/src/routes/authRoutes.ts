import { Router } from "express";
import authSignupController from "../controllers/authControllers/authSignupController";
import passport from "passport";
import authSignInController from "../controllers/authControllers/authSigninController";
import authSignOutController from "../controllers/authControllers/authSignOutController";
import userDataController from "../controllers/authControllers/userDataController";
import checkEmailKeyController from "../controllers/authControllers/emailConfirm/checkEmailKeyController/checkEmailKeyController";
import resendEmailController from "../controllers/authControllers/emailConfirm/resendEmailController/resendEmailController";
import { createTokenSendLinkController } from "../controllers/authControllers/passwordReset/createTokenSendLinkController/createTokenSendLinkController";
import { checkResetTokenController } from "../controllers/authControllers/passwordReset/checkResetTokenController/checkResetTokenController";

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

router.post("/create-reset-token", createTokenSendLinkController);
router.post("/confirm-reset-token", checkResetTokenController);
export default router;
