import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { generateTokenValidation } from "../validation/token-validation";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";

const generateToken = async (header, body) => {

    body = validate(generateTokenValidation, body);

    if (!header) {
        throw new ResponseError(400, "Header can not be empty");
    }

    if (!header.Authorization) {
        throw new ResponseError(400, "Authorization can not be empty");
    }

    const authorization = header.Authorization;

    if (!authorization.includes("Basic ")) {
        throw new ResponseError(400, "Invalid Authorization format");
    }

    const clientAuth = authorization.replace("Basic ", "");

    const decodeAuthClient = atob(clientAuth); // atob = decode base64

    const explode = decodeAuthClient.split(":");

    const clientId = explode[0];
    const clientSecret = explode[1];

    const getAccount = await prismaClient.clients.findFirst({
        where: {
            client_id: clientId,
            clientSecret: clientSecret
        },
        select: {
            client_id: true,
            client_secret: true,
            grant_type: true,
            user_id: true,
            scope: true
        }
    });

    if (getAccount.grant_type != body.grant_type) {
        throw new ResponseError(403, "Grant type is invalid.");
    }

    const unixTimestamp = Date.now();

    const composeString = clientId + clientSecret + body.grant_type + unixTimestamp.toString();

    const token = await bcrypt.hash(composeString, 10);

    const timestampInSecond = Math.floor(unixTimestamp / 1000);

    const saveAccessToken = await prismaClient.accessTokens.create({
        data: {
            access_token: token,
            client_id: clientId,
            expired_in: timestampInSecond,
            scope: "basic",
            user_id: getAccount.user_id
        }
    })

    if (!saveAccessToken) {
        throw new ResponseError(500, "Error generating token");
    }

    const response = {
        access_token: token,
        expired_in: timestampInSecond,
        scope: "basic"
    }

    return response;


}