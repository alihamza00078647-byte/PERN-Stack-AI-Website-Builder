import {Request, Response, NextFunction} from "express";
import {auth} from "../lib/auth.js"
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma.js";
import { openai } from "../config/openai.js";


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

        // Enchance user prompt
        const promptEnchancedResponse = await openai.chat.completions.create({
            model : "z-ai/glm-4.5-air:free",
            messages : [
                {
                    role: "system",
                    content: `You are a prompt enhancement specialist. Take the user's website request and expand it into a detailed, comprehensive prompt that will help create the best possible website.

                    Enhance this prompt by:
                    1. Adding specific design details (layout, color scheme, typography)
                    2. Specifying key sections and features
                    3. Describing the user experience and interactions
                    4. Including modern web design best practices
                    5. Mentioning responsive design requirements
                    6. Adding any missing but important elements

                    Return ONLY the enhanced prompt, nothing else. Make it detailed but concise (2-3 paragraphs max).`
                },
                {
                    role: "user",
                    content: initial_prompt
                }

            ]
        })

        const enchancePrompt = promptEnchancedResponse.choices[0].message.content;
        
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: `I 've enchance your prompt: ${enchancePrompt}`
            }
        })

    } catch (error:any) {
        return res.status(500).json({message: error.code || error.message});
    }  
}  
