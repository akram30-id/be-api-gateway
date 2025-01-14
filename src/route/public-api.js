import express from "express";
import cors from "cors";
import userController from "../controller/user-controller.js";
import tokenController from "../controller/token-controller.js";

const publicRouter = express.Router();

publicRouter.use(cors(/*whitelistMiddleware*/));

publicRouter.post('/apigw/token', userController.register);
publicRouter.post('/apigw/reg-password', userController.registerPassword);

// TOKEN MODULE
publicRouter.post('/apigw/access-token', tokenController.generateToken);
publicRouter.post('/apigw/cek-token', tokenController.cekToken);

export {
    publicRouter
}