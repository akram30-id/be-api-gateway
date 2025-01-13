import { logger } from "../application/logging.js";

const whitelist = [
    'http://localhost:3000'
];

export const whitelistMiddleware = {
    origin: (origin, callback) => {
        logger.info(origin);
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Access Forbiden'))
        }
    }
}