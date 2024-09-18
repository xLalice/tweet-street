import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";

dotenv.config();



export const login = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate("local", { session: false }, (err: any, user: User | false, info: any) => {
        if (err || !user) {
            return res.status(400).json({
                message: "Invalid email or password",
                error: info ? info.message : "Login failed",
            });
        }

        req.login(user, { session: false }, async (loginErr: any) => {
            if (loginErr) {
                return next(loginErr);
            }
            const token = jwt.sign(
                { sub: user.id, email: user.email },
                process.env.JWT_SECRET!, 
                { expiresIn: "1h" }
            );

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 3600000
            })

            return res.json({
                message: "Login successful",
                user: {
                    id: user.id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePic,
                }
            });
        });
    })(req, res, next);
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, age } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                password: hashedPassword,
                age
            }
        });

        const token = jwt.sign(
            { sub: newUser.id, email: newUser.email },
            process.env.JWT_SECRET!, 
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: newUser.id,
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: "Server error" });
    }
};
