import tokenService from "../service/token-service.js";

const generateToken = async (req, res, next) => {
    try {
        const request = req.body;
        const header = req.headers;

        const result = await tokenService.generateToken(header, request);

        res.status(200).json({
            data: result
        })
    } catch (e) {
        next(e)
    }
}

const cekToken = async (req, res, next) => {
    try {
        const request = req.body;
        const header = req.headers;

        const result = await tokenService.cekToken(header, request);

        res.status(200).json({
            data: result
        });
    } catch (e) {
        next(e)
    }
}

export default {
    generateToken,
    cekToken
}