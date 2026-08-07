import {Request, Response, NextFunction} from "express";
import {auth} from "../lib/auth.js"
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma.js";


// Get User Credits
export const getUserCredits = async (req: Request, res: Response, next:NextFunction) => {
    try {
        
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({message : "Unauthorized"});
        }

        const user = await prisma.user.findUnique({
            where : {id : userId}
        });

        res.json({credits: user?.credits});

    } catch (error:any) {
        return res.status(500).json({message: error.code || error.message});
    }  
}  




export const createUserProject = async (req: Request, res: Response, next:NextFunction) => {
    try {
        
        const {initial_prompt} = req.body;
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({message : "Unauthorized"});
        }

        const user = await prisma.user.findUnique({
            where : {id : userId}
        });

        if (user && user.credits < 5) {
            res.status(403).json({message: "Add Credits To create more project"})
        }

        // create new Project
        const project = prisma.websiteProject.create({
            data: {
                name : initial_prompt.length < 50 ? initial_prompt.substring(0, 47) + "..." : initial_prompt,
                initial_prompt,
                userId
            }
        })

        // update user creations
        await prisma.user.update({
            where: {id: userId},
            data : {totalCreation: {increment: 1}}
        })

        await prisma.conversation.create({
            data : {
                role: "user",
                content: initial_prompt,
                projectId : project.id
            }
        });

        await prisma.user.update({
            where: {id : userId},
            data : {credits: {decrement: 5}}
        });



        res.json({projectId: project.id});

    } catch (error:any) {
        return res.status(500).json({message: error.code || error.message});
    }  
}  
