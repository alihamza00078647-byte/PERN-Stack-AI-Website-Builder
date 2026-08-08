import type {Request, Response} from "express";
import { prisma } from "../lib/prisma.js";
import { openai } from "../config/openai.js";


// project revision
export const getUserCredits = async (req: Request, res: Response) => {
    const userId = req.userId;
    try {

        const {projectId} = req.params;
        const {message} = req.body;
        
        if (typeof userId !== "string") {
            return res.json({message: "userId is Not string type"});
        }

        const user = await prisma.user.findUnique({
            where : {id : userId}
        });


        if (!userId || !user) {
            return res.status(401).json({message : "Unauthorized"});
        }
        
        if (user.credits < 5) {
            return res.status(403).json({message : "Add more Credits To make Changes"});
        }
        
        if (!message || message.trim() === "") {
            return res.status(400).json({message : "Please enter Valid Prompt"});
        }
        
        const currentProject = await prisma.websiteProject.findUnique({
            where : {id: projectId, userId},
            include: {versions: true}
        })
        
        if (!currentProject) {
            return res.status(404).json({message : "Project Not found"});
        }

        await prisma.conversation.create({
            data: {
                role: "user",
                content: message,
                projectId
            }
        });

        await prisma.user.update({
            where: {id: userId},
            data: {credits: {decrement: 5}}
        });

        // Enchance user response
        const promptEnhanceResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages : [
                {
                    role: "system",
                    content: `
                    You are a prompt enhancement specialist. The user wants to make changes to their website. Enhance their request to be more specific and actionable for a web developer.

                    Enhance this by:
                    1. Being specific about what elements to change
                    2. Mentioning design details (colors, spacing, sizes)
                    3. Clarifying the desired outcome
                    4. Using clear technical terms

                    Return ONLY the enhanced request, nothing else. Keep it concise (1-2 sentences).`
                }, {
                    role: "user",
                    content: `User's Request: ${message}`
                }
            ]
        })

        const enchancePrompt = promptEnhanceResponse.choices[0]?.message.content;

        await prisma.conversation.create({
            data: {role : "assistant", 
            content: `I 've Enchance your Prompt to ${enchancePrompt}`,
            projectId,
        }
        })
        await prisma.conversation.create({
            data: {
                role : "assistant", 
                content: `Now, making changes in your website...`,
                projectId,
            }
        })

        // Code generation response
        const codeGenerationResponse = await openai.chat.completions.create({
            model: "z-ai/glm-4.5-air:free",
            messages : [
                {
                    role: "system",
                    content: `You are an expert web developer. 

                    CRITICAL REQUIREMENTS:
                    - Return ONLY the complete updated HTML code with the requested changes.
                    - Use Tailwind CSS for ALL styling (NO custom CSS).
                    - Use Tailwind utility classes for all styling changes.
                    - Include all JavaScript in <script> tags before closing </body>
                    - Make sure it's a complete, standalone HTML document with Tailwind CSS
                    - Return the HTML Code Only, nothing else
                    
                    Apply the requested changes while maintaining the Tailwind CSS styling approach.`
                }, {
                    role: "user",
                    content: `Here is current website Code: ${currentProject.current_code}
                    User wants this change: ${enchancePrompt}`
                }
            ]
        })

        const code = codeGenerationResponse.choices[0]?.message.content || "";

        const version = await prisma.version.create({
            data: {
                code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                description: "initial version",
                projectId,
            }
        })


        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "I 've make the changes. Now you can preview it.",
                projectId
            }
        })

        await prisma.websiteProject.update({
            where: {id: projectId},
            data: {
                code: code.replace(/```[a-z]*\n?/gi, "").replace(/```$/g, "").trim(),
                current_version_index : version.id,
            }
        })

        res.json({messages: "Create Changes Successfully"});

    } catch (error:any) {
        await prisma.user.update({
            where: {id: userId},
            data: { credits: {decrement: 5}}
        })
        return res.status(500).json({message: error.code || error.message});
    }  
}  



// function to rollback to previous version   

export const makeRevision = async (req:Request, res:Response) => {
    try {
        
        const userId = req.userId;

    } catch (error) {
        
    }
}


export const rollbackToVersion = async (req:Request, res:Response) => {
    try {
        const userId = req.userId;
        
        if (!userId) {
            return res.status(401).json({message: "Unauthorized"});
        }
        
        const {projectId, versionId} = req.params;
        
        if (typeof projectId !== "string") {
            return res.status(403).json({message: "project Id is not valid type"})
        }        

        const project = await prisma.websiteProject.findUnique({
            where: {id: projectId, userId},
            include: {versions: true}
        })
        
        if (!project) {
            return res.status(404).json({message: "Project Not found"});
        }
        
        const version = project.versions.find((version) => version.id === versionId);
        
        if (!version) {
            return res.status(404).json({message: "Version Not found"});
        }

        await prisma.websiteProject.update({
            where: {id: projectId, userId},
            data: {
                current_code: version.code,
                current_version_index: version.id
            }
        })
        await prisma.conversation.create({
            data: {
                role: "assistant",
                content: "Rolled Back To previous version successfully",
                projectId
            }
        })

        res.json({message: "version Rolled back"})

    } catch (error: any) {
        console.log(error.code || error.message);
        res.status(500).json({message: error.message})
    }
}



// function to delete the project
const deleteProject = async (req: Request, res:Response) => {
    try {
        
        const userId = req.userId;
        const { projectId } = req.params;

        if (!userId) {
            return res.status(401).json({message: "Unauthorized"});
        }

        if (typeof projectId !== "string") {
            return res.status(403).json({message: "project Id is not valid type"})
        }  

        await prisma.websiteProject.delete({
            where: {id: projectId, userId}
        })
        
        res.json({})
        
    } catch (error:any) {
        console.log(error.code || error.message);
        res.status(500).json({message: error.message});
    }
}
