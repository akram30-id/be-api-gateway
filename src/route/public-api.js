import express from "express";
// import userController from "../controller/user-controller.js";
import cors from "cors";
import { whitelistMiddleware } from "../middleware/whitelist-middlewate.js";
import userController from "../controller/user-controller.js";

const publicRouter = express.Router();

publicRouter.use(cors(/*whitelistMiddleware*/));

publicRouter.post('/apigw/token', userController.register);
publicRouter.post('/apigw/reg-password', userController.registerPassword);

export {
    publicRouter
}