import express from "express";
import * as userController from "../controller/user.controller";
import {
  authenticateForAdmin,
  authenticateForUser,
} from "../middleware/authentication.middleware";
const userRouter = express.Router();

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.post("/login/verify", userController.verifyForLogin);

userRouter.post("/delete", [authenticateForAdmin], userController.deleteUser);
userRouter.get("/profile/:username", userController.getProfileByUsername);
userRouter.get(
  "/my/profile",
  [authenticateForUser],
  userController.getMyProfile
);
userRouter.get("/", [authenticateForAdmin], userController.getUsers);
userRouter.post(
  "/my/profile/preferences",
  [authenticateForUser],
  userController.updatePreferences
);

userRouter.post(
  "/reset/password",
  [authenticateForUser],
  userController.resetPassword
);
userRouter.post(
  "/reset/password/verify",
  [authenticateForUser],
  userController.verifyForResetPassword
);

userRouter.post(
  "/update",
  [authenticateForUser],
  userController.updatePreferences
);

userRouter.get("/", [authenticateForAdmin], userController.getUsers);

export default userRouter;
