import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "./prisma";
require("dotenv").config();

passport.use(
    new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await prisma.user.findUnique({where: {email}})
                if (!user){
                    return done(null, false, {message: "User not found"});
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch){
                    return done(null, false, {message: "Incorrect password"});
                }
                return done(null, user);
            } catch(error){
                return done(error);
            }
        }
    )
);

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret
}

passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
    try {
        const user = await prisma.user.findUnique({where: {id: payload.sub}});
        if (!user){
            return done(null, false);
        }
        return done(null, user);
    } catch(error){
        return done(error);
    }
}))