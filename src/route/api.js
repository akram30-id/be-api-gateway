import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";

import cors from "cors";

const userRouter = express.Router();

userRouter.use(cors());

userRouter.use(authMiddleware)

// USER API
// userRouter.delete('/api/users/logout', userController.logout);
// userRouter.post('/api/users/update', userController.updatePassword);

export {
    userRouter
}