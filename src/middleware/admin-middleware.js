import { prismaClient } from "../application/database.js";

export const adminMiddleware = async (req, res, next) => {
    const user = req.user.username;

    if (!user) {
        res.status(400).json({
            error: 'Unauthorized Username of administrator'
        }).end();
    } else {
        const checkUser = await prismaClient.user.findFirst({
            where: {
                username: user
            },
            select: {
                role: true,
                username: true
            }
        });

        if (!checkUser) {
            res.status(404).json({
                error: 'User is not found.'
            }).end();
        } else if (checkUser.role != 'admin') {
            res.status(403).json({
                error: 'Unauthorized Administrator'
            }).end();
        } else {
            req.user = checkUser;
            next();
        }
    }

}