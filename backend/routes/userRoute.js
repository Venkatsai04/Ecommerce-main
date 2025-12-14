import express from "express";
import {
  loginUser,
  registerUser,
  loginAdmin,
} from "../controllers/userController.js";
import { forgotPassword, resetPassword } from "../controllers/userController.js";

const userRouter = express.Router();


userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser); 
userRouter.post("/admin", loginAdmin);

export default userRouter;
