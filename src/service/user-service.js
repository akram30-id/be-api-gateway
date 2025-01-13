import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { loginValidation, registerPasswordValidation, registerUserValidation } from "../validation/user-validation.js"
import { validate } from "../validation/validation.js"
import bcrypt from "bcrypt"

const register = async (request) => {

    request = validate(registerUserValidation, request);

    const getAccount = await prismaClient.user.findFirst({
        where: {
            email: request.email
        }
    });

    if (getAccount) {
        throw new ResponseError(400, "Account is already exist")
    }

    return prismaClient.user.create({
        data: {
            email: request.email,
            password: "X",
            scope: "owner",
            first_name: request.first_name,
            last_name: request.last_name
        },
        select: {
            email: true
        }
    });
}

const registerPasword = async (request) => {
    request = validate(registerPasswordValidation, request);

    const getAccount = await prismaClient.user.findFirst({
        where: {
            email: request.email
        }
    });

    if (!getAccount) {
        throw new ResponseError(404, "Account is not found");
    }

    if (request.password != request.confirm_password) {
        throw new ResponseError(400, "Password and confirmation password must be same.")
    }

    const hashPassword = await bcrypt.hash(request.password, 10);

    const clientId = Date.now();
    const clientSecret = await bcrypt.hash(clientId.toString(), 5);

    const generateClient = await prismaClient.clients.create({
        data: {
            client_id: clientId.toString(),
            client_secret: clientSecret,
            grant_type: "client_credentials",
            scope: "basic",
            user_id: getAccount.id
        }
    });

    if (!generateClient) {
        throw new ResponseError(500, "Error when generating client");
    }

    const generatePassword = await prismaClient.user.update({
        where: {
            email: request.email
        },
        data: {
            password: hashPassword
        },
        select: {
            email: true
        }
    });

    generatePassword['clientId'] = clientId;
    generatePassword['clientSecret'] = clientSecret;
    generatePassword['scope'] = "basic";

    return generatePassword;

}

const login = async (request) => {
    request = validate(loginValidation, request);

    const getAccount = await prismaClient.user.findFirst({
        where: {
            email: request.email
        }
    });

    if (!getAccount) {
        throw new ResponseError(404, "User is not found");
    }

    const hashPassword = await bcrypt.hash(request.password, 10);

    if (getAccount.password != hashPassword) {
        throw new ResponseError(403, "Email or password is invalid");
    }

    const response = {
        email: getAccount.email
    }
}

export default {
    register,
    registerPasword
}