import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { cekTokenValidation, generateTokenValidation } from "../validation/token-validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";

const generateToken = async (header, body) => {

    body = validate(generateTokenValidation, body);

    if (!header) {
        throw new ResponseError(400, "Header can not be empty");
    }

    if (!header.authorization) {
        throw new ResponseError(400, "Authorization Header can not be empty");
    }

    if (!header['content-type']) {
        throw new ResponseError(400, "Content-Type Header can not be empty");
    }

    const authorization = header.authorization;
    const contentType = header['content-type'];

    if (!authorization.includes("Basic ")) {
        throw new ResponseError(400, "Invalid Authorization format");
    }

    if (contentType != 'application/json') {
        throw new ResponseError(400, "Invalid content type");
    }

    const clientAuth = authorization.replace("Basic ", "");

    const decodeAuthClient = atob(clientAuth); // atob = decode base64

    const explode = decodeAuthClient.split(":");

    const clientId = explode[0];
    const clientSecret = explode[1];

    const getAccount = await prismaClient.clients.findFirst({
        where: {
            client_id: clientId,
            client_secret: clientSecret
        }
    });

    if (getAccount.grant_type != body.grant_type) {
        throw new ResponseError(403, "Grant type is invalid.");
    }

    const unixTimestamp = Date.now();

    const composeString = clientId + clientSecret + body.grant_type + unixTimestamp.toString();

    const token = await bcrypt.hash(composeString, 10);

    const timestampInSecond = Math.floor(unixTimestamp / 1000);

    const expiredIn = timestampInSecond + 300;

    const saveAccessToken = await prismaClient.accessTokens.create({
        data: {
            access_token: token,
            client_id: clientId,
            expired_in: expiredIn.toString(),
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

const cekToken = async (header, body) => {

    body = validate(cekTokenValidation, body);

    const authorization = header.authorization;

    if (!authorization.includes("Bearer ")) {
        throw new ResponseError(400, "Invalid authorization format");
    }

    const token = authorization.replace('Bearer ', '');

    const getTokenDetail = await prismaClient.accessTokens.findFirst({
        where: {
            access_token: token
        }
    });

    if (!getTokenDetail) {
        throw new ResponseError(404, "Access token is not found");
    }

    if (body.action != 'check token available') {
        throw new ResponseError(400, "Invalid action parameter");
    }

    const unixTimestamp = Date.now();
    const timestampInSecond = Math.floor(unixTimestamp / 1000);

    const tokenExpiredDB = getTokenDetail.expired_in;

    if (timestampInSecond > tokenExpiredDB) {
        throw new ResponseError(403, "Token is already expired. Request timestamp: " + timestampInSecond);
    }

    const response = {
        access_token: getTokenDetail.access_token,
        expired_in: parseInt(tokenExpiredDB),
        scope: "basic"
    }

    return response;
}

export default {
    generateToken,
    cekToken
}