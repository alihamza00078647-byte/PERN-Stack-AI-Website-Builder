import type {Request, Response, NextFunction}from "express";
import {auth} from "../lib/auth.js"
import { fromNodeHeaders } from "better-auth/node";
import { prisma } from "../lib/prisma.js";
import { openai } from "../config/openai.js";
import { version } from "node:os";
import { useId } from "react";


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
    const userId = req.userId as string;
    try {
        
        const {initial_prompt} = req.body;

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
                projectId : (await project).id
            }
        });

        await prisma.user.update({
            where: {id : userId},
            data : {credits: {decrement: 5}}
        });

        res.json({projectId: (await project).id});

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

        const enchancePrompt = promptEnchancedResponse.choices[0]?.message.content;
        
        await prisma.conversation.create({
            data : {
                role: "assistant",
                content: `I 've enchance your prompt: ${enchancePrompt}`,
                projectId: (await project).id
            }
        })

        // Generate Website Code
        const codeGenerationResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages : [
                {
                    role: "system",
                    content: `You are an expert web developer. Create a complete, production-ready, single-page website based on this request: "${enhancedPrompt}"

                CRITICAL REQUIREMENTS:
                - You MUST output valid HTML ONLY. 
                - Use Tailwind CSS for ALL styling
                - Include this EXACT script in the <head>: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
                - Use Tailwind utility classes extensively for styling, animations, and responsiveness
                - Make it fully functional and interactive with JavaScript in <script> tag before closing </body>
                - Use modern, beautiful design with great UX using Tailwind classes
                - Make it responsive using Tailwind responsive classes (sm:, md:, lg:, xl:)
                - Use Tailwind animations and transitions (animate-*, transition-*)
                - Include all necessary meta tags
                - Use Google Fonts CDN if needed for custom fonts
                - Use placeholder images from https://placehold.co/600x400
                - Use Tailwind gradient classes for beautiful backgrounds
                - Make sure all buttons, cards, and components use Tailwind styling

                CRITICAL HARD RULES:
                1. You MUST put ALL output ONLY into message.content.
                2. You MUST NOT place anything in "reasoning", "analysis", "reasoning_details", or any hidden fields.
                3. You MUST NOT include internal thoughts, explanations, analysis, comments, or markdown.
                4. Do NOT include markdown, explanations, notes, or code fences.

                The HTML should be complete and ready to render as-is with Tailwind CSS.`
                }, {
                    role: "user",
                    content: enchancePrompt || ""
                }
            ]
        })

        // code generation response
        const code = codeGenerationResponse.choices[0]?.message.content || "";

        // create version for the project
        const version = await prisma.version.create({
            data : {
                code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                description: "Initial Version",
                projectId: (await project).id
            }
        })

        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "I 've Created the Website. Preview it and can make changes",
                projectId: (await project).id
            }
        })

        // update data in website project DB
        await prisma.websiteProject.update({
            where: {id: (await project).id},
            data: {
                current_code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                current_version_index: version.id
            }
        })


    } catch (error:any) {
        await prisma.user.update({
            where: {id: userId},
            data: {credits: {increment : 5}}
        })
        return res.status(500).json({message: error.message});
    }  
}  



// controller function to get a single project
export const getUserProject = async (req: Request, res: Response, next:NextFunction) => {
    const userId = req.userId;
    try {    
        if (!userId) {
            return res.status(401).json({message : "Unauthorized"});
        }

       const {projectId} = req.params;
       
       const project = await prisma.websiteProject.findUnique({
         where: {id: projectId, userId},
         include: {
            conversation : {
                orderBy : {
                    timestamp: "asc"
                }
            },
            versions: {orderBy: {timestamp: "asc"}},
         }
       })

        res.json({project});

    } catch (error:any) {
        console.log(error.code);
        return res.status(500).json({message: error.message});
    }  
}  



// controller function to get All projects
export const getUserProjects = async (req: Request, res: Response, next:NextFunction) => {
    const userId = req.userId;
    try {    
        if (!userId) {
            return res.status(401).json({message : "Unauthorized"});
        }

       const projects = await prisma.websiteProject.findMany({
        where: {id: userId},
        orderBy: {updatedAt: "desc"}
       })
       

        res.json({projects});

    } catch (error:any) {
        console.log(error.code);
        return res.status(500).json({message: error.message});
    }  
}  


// controller function to toggle all publish projects
export const togglePublish = async (req: Request, res: Response, next:NextFunction) => {
    
    try {    
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({message : "Unauthorized"});
        }

       const {projectId} = req.params;

       if (typeof projectId !== "string") {
        return res.status(400).json({ message: "Invalid project id" });
       }

       const project = await prisma.websiteProject.findUnique({
        where: {id: projectId, userId}
       })

       if (!project) {
         return res.json({message: "Project Not found!"});
       }
       
       await prisma.websiteProject.update({
        where: {id: projectId},
        data: {isPublished: !project.isPublished}
       })

        res.json({message: project.isPublished ? "Project Unpublished": "Project Published Successfully"});

    } catch (error:any) {
        console.log(error.code);
        return res.status(500).json({message: error.message});
    }  
}  


// Controller function to purchase credits
export const purchaseCredits = async (req:Request, res:Response) => {

}
