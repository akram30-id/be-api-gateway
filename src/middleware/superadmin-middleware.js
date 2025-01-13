import { prismaClient } from "../application/database.js";

export const superadminMiddleware = async (req, res, next) => {
    const user = req.user.username;

    if (!user) {
        res.status(400).json({
            error: 'Unauthorized Username of Superadmin'
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
                error: 'Unauthorized Superadmin'
            }).end();
        } else if (checkUser.role != 'superadmin') {
            res.status(403).json({
                error: 'Unauthorized Superadmin'
            }).end();
        } else {
            req.user = checkUser;
            next();
        }
    }

}