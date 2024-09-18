import { Request, Response, NextFunction } from "express";

export const extractTokenFromCookie = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token; 
    if (token) {
        req.headers.authorization = `Bearer ${token}`;
    }
    next();
};