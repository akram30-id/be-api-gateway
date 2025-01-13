import { prismaClient } from "../application/database.js";
import axios from "axios";

const dashboardUrl = () => {
    const getenv = env("ENVIRONMENT");

    let gatewayURL;

    if (getenv === "LOCAL") {
        gatewayURL = "http://127.0.0.1:301";    
    }

    if (getenv === "TEST") {
        gatewayURL = "http://test.dashboard.findlesson.net:301";    
    }

    if (getenv === "PRODUCTION") {
        gatewayURL = "http://api.dashboard.findlesson.net:301";    
    }

    return gatewayURL;
}

const authentication = async () => {
    const gatewayURL = dashboardUrl();

    const result = await axios.post(`${gatewayURL}/api/users/token`, {
        "username": env("USERNAME"),
        "password": env("PASSWORD")
    });

    return result;
}

export const authMiddleware = async (req, res, next) => {
    const token = req.get('Authorization');

    if (!token) {
        res.status(401).json({
            errors: 'Unauthorized'
        }).end()
    } else {
        const auth = token.replace("Basic ", "");
        
        Promise.all([authentication()]).then((response) => {
            if (response.data.token === auth) {
                next();
            }
        }).catch(e => res.status(401).json({
            errors: 'Unauthorized'
        }).end())
    }
}