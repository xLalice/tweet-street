import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as { id: string }).id; 

        const followingUsers = await prisma.follow.findMany({
            where: {
                followerId: userId,
                status: 'ACCEPTED',
            },
            select: {
                followingId: true, 
            },
        });

        const followingIds = followingUsers.map(follow => follow.followingId);
        const posts = await prisma.post.findMany({
            where: {
                authorId: {
                    in: followingIds, 
                },
            },
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                        profilePic: true,
                    },
                },
                comments: true, 
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

  

export const getPost = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const post = await prisma.post.findUnique({where: {id}});
        if (!post){
            return res.status(404).json({message: "Post does not exist"});
        }

        res.json({post})

    } catch(error){
        console.error("Error fetching post", error);
        res.status(500).json({messsage: "Server error", error});
    }
}

export const createPost = async (req: Request, res: Response) => {
    try {
        const authorId = (req.user as User).id;
        const {title, content} = req.body;

        if (!title || !content){
            return res.status(400).json({message: "Invalid title/content"})
        }

        const createdPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId
            }
        });

        res.json(createPost);
    } catch(error){
        console.error("Error creating post", error);
        res.status(500).json({messsage: "Server error", error});
    }
}

export const updatePost = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {title, content} = req.body;

        if (!title || !content){
            return res.status(400).json({message: "Invalid title/content"});
        }

        const updatedPost = await prisma.post.update({
            where: {id},
            data: {
                title,
                content
            }
        });

        res.json(updatePost);
    } catch(error){
        console.error("Error updating post", error);
        res.status(500).json({messsage: "Server error", error});
    }
}

export const deletePost = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;

        const exists = await prisma.post.findFirst({ where: {id}});
        if (!exists) {
            return res.status(404).json({message: "Post does not exist"});
        }

        await prisma.post.delete({where: {id}});

        res.json({message: "Successfully deleted"});
    } catch(error){
        console.error("Error deleting post", error);
        res.status(500).json({messsage: "Server error", error});
    }
}