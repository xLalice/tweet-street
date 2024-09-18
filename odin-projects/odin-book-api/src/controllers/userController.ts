import express, { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import jwt from "jsonwebtoken";
require("dotenv").config();

export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    const {firstName, lastName, email, password, age, bio, profilePic} = req.body;

    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { sub : string};
        const userId = decoded.sub;

        const updatedUser = await prisma.user.update({
            where : { id: userId},
            data: {
                firstName,
                lastName,
                email,
                password,
                age,
                bio,
                profilePic
            }
        });

        res.json({
            message: "User profile updated successfully",
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                first_name: updatedUser.firstName,
                last_name: updatedUser.lastName,
                profilePic: updatedUser.profilePic
            }
        });
    } catch(error){
        console.error("Error updating user profile: ", error);
        res.status(500).json({message: "Server error", error})
    }
}

export const followUser = async (req: Request, res: Response) => {
    const {followingId} = req.params;
    const followerId = (req.user as User).id;

    try {
        const userToFollow = await prisma.user.findUnique({where: {id: followingId}});
        if (!userToFollow){
            return res.status(404).json({message: "User not found"});
        }

        const existingFollow = await prisma.follow.findFirst({
            where: {followerId, followingId}
        });

        if (existingFollow){
            return res.status(400).json({message: "Already following this user"})
        };

        const followStatus = userToFollow.isPrivate ? 'PENDING' : 'ACCEPTED';
        const followRequest = await prisma.follow.create({
            data: {
                followerId,
                followingId,
                status: followStatus
            }
        });

        res.status(201).json({
            message: followStatus === "PENDING" ? "Follow request sent" : "Now following user",
            follow: followRequest
        })
    } catch(error){
        console.error("Error followng user: ", error);
        res.status(500).json({message: "Server error", error});
    }
}

export const unfollowUser = async (req: Request, res: Response) => {
    try {
        const {followingId} = req.params;
        const followerId = (req.user as User).id;

        const followRelationship = await prisma.follow.findFirst({
            where: {followerId, followingId}
        });

        if (!followRelationship){
            res.status(404).json({message: "Not following the user"});
        }

        await prisma.follow.delete({
            where: { id: followRelationship?.id}
        })
        res.status(200).json({message: "Unfollowed successfully"});
    } catch(error){
        console.error("Error unfollowng user: ", error);
        res.status(500).json({message: "Server error", error});
    }
}

export const respondToFollowRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as User).id; 
        const { followerId, action } = req.body; 

        const followRequest = await prisma.follow.findFirst({
            where: { followerId, followingId: userId, status: 'PENDING' }
        });

        if (!followRequest) {
            return res.status(404).json({ message: "Follow request not found" });
        }

        if (action === "accept") {
            await prisma.follow.update({
                where: { id: followRequest.id },
                data: { status: 'ACCEPTED' }
            });
            res.status(200).json({ message: "Follow request accepted" });
        } else if (action === "decline") {
            await prisma.follow.update({
                where: { id: followRequest.id },
                data: { status: 'REJECTED' }
            });
            res.status(200).json({ message: "Follow request declined" });
        } else {
            res.status(400).json({ message: "Invalid action" });
        }
    } catch (error) {
        console.error("Error responding to follow request:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
