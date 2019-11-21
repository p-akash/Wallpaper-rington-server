import express from "express";
import {
  signin,
  signup,
  forgotPassword,
  resetPassword,
  changePassword,
  checkAuth,
  signupConfirm,
  setUserStatus,
  editProfile
} from "./auth.controller";
import { requireAuth, requireSignIn } from "./auth.middleware";

export const authRouter = express.Router();

authRouter.get("/", requireAuth, (req, res) => {
  res.send({ message: "You are accessing a protected route" });
});

authRouter.post("/signin", requireSignIn, signin);
authRouter.post("/signup", signup);
authRouter.put("/editProfile/:_id", requireAuth, editProfile);
authRouter.get("/checkauth", requireAuth, checkAuth);
authRouter.post("/forgotpassword", forgotPassword);
authRouter.post("/resetpassword", resetPassword);
authRouter.post("/changepassword", requireAuth, changePassword);
authRouter.get("/signupconfirm", signupConfirm);
authRouter.post("/setuserstatus", requireAuth, setUserStatus);
