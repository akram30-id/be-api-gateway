import winston from "winston";
import path from "path";
import { fileURLToPath } from 'url';

// Get the directory name of the current module file
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logDirectory = path.join(__dirname, 'log');

export const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({}),
        new winston.transports.File({
            filename: path.join(logDirectory, `${new Date().getFullYear()}${new Date().getMonth() + 1}${new Date().getDate()}_${new Date().getHours()}.log`)
        })
    ]
})