import jwt from 'jsonwebtoken';

export const generateToken = (
    jwtPayload: {
        email: string;
        role: string;
    },
    secret: string,
    expiresIn: number,
): string => {
    return jwt.sign(jwtPayload, secret, { expiresIn });
};
