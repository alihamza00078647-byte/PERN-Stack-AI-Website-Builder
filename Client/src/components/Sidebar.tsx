import { BotIcon,  EyeIcon, Loader2Icon, SendIcon, UserIcon } from "lucide-react";
import type { Message, Project, Version } from "../Types"
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";


interface SidebarProps {
    isMenuOpen : boolean,
    project: Project,
    setProject: (project: Project) => void;
    isGenerating : boolean,
    setIsGenerating: (isGenerating: boolean) => void;
}

export default function Sidebar({project, setProject, setIsGenerating, isGenerating, isMenuOpen}: SidebarProps) {
    
    const messageRef = useRef<HTMLDivElement>(null);
    const [input, setInput] = useState('');
    
    const handleRollBack = async (versionId:string) => {

    }


    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.scrollIntoView({behavior: 'smooth'});
        }
    }, [project.conversation.length, isGenerating]);

    return (
        <div className={`w-full sm:max-w-sm bg-gray-900 border-gray-800 rounded-xl transition-all ${isMenuOpen ? "sm:max-w-0 overflow-hidden" : "w-full"}`}>
            <div className="flex flex-col h-full">
                {/* -------- Message Container -------- */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4">
                    {[...project.conversation, ...project.versions].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message)=> {
                        const isMessage = 'content' in message;
                        if (isMessage) {
                            const msg = message as Message;
                            const isUser = msg.role === 'user';
                            return (
                                <div key={msg.id} className={`flex items-center gap-3 ${isUser ? "justify-end": "justify-start"}`}>
                                    {!isUser && (
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-linear-to-br from-indigo-500 to-indigo-600">
                                            <BotIcon className="size-5 text-white"/>
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-5 ${isUser? "bg-linear-to-br  text-white from-indigo-500 to-indigo-600 rounded-tr-none" : "text-gray-100 bg-gray-800 rounded-tl-none"}`}>
                                        {msg.content}
                                    </div>

                                    { isUser && (
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center bg-gray-700">
                                            <UserIcon className="size-5 text-gray-200" />
                                        </div>
                                    )}
                                </div>
                            )
                        } else {
                            const ver = message as Version;
                            return (
                                <div key={ver.id} className="w-4/5 mx-auto my-2 p-3 rounded-xl text-gray-100 bg-gray-800 shadow flex flex-col gap-2">
                                    <div className="text-xs font-medium">
                                        code updated <br /> <span className="text-gray-500 text-xs font-normal">
                                            {new Date(ver.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        {project.current_version_index === ver.id? (
                                            <button className="text-xs rounded-md px-3 py-1 bg-gray-700">Curent Version</button>
                                        ): (
                                            <button onClick={() => handleRollBack(ver.id)} className="text-xs text-white rounded-md px-3 py-1 bg-indigo-600 hover:bg-indigo-500">Roll back to this version</button>
                                        )}
                                        <Link to={`/projects/${project.id}/${ver.id}`} target="_blank">
                                          <EyeIcon className="size-6 p-1 bg-gray-700 hover:bg-indigo-500 rounded-md transition-colors" />
                                        </Link>
                                    </div>
                                </div>
                            )
                        }
                    })}
                    { isGenerating && (
                        <div className="flex items-start justify-start gap-3">
                            <div className="h-8 w-8 rounded-md bg-linear-to-br from-indigo-600 to-indigo-700 flex justify-center items-center">
                                <BotIcon className="size-5 text-white"/>
                            </div>
                            {/* ------- Three Dot ------- */}
                            <div className="flex gap-1.5 items-center h-full">
                                <span className="size-2 rounded-full bg-gray-600 animate-bounce" style={{animationDelay: "0s"}} />
                                <span className="size-2 rounded-full bg-gray-600 animate-bounce" style={{animationDelay: "0.2s"}} />
                                <span className="size-2 rounded-full bg-gray-600 animate-bounce" style={{animationDelay: "0.4s"}} />
                            </div>
                        </div>
                    )}

                    <div ref={messageRef} />
                </div>
                {/* -------- Input Area   -------- */}
                <form className="m-3 relative">
                    <div className="flex items-center gap-2">
                        <textarea onChange={(e) => setInput(e.target.value)} value={input} rows={4} placeholder="Build a WebApp or ask for changes" className="flex-1 rounded-xl p-3 resize-none text-sm outline-none ring ring-gray-700 focus:ring-indigo-500 bg-gray-800 text-gray-100 placeholder-gray-400 transition-all" disabled={isGenerating}/>
                        <button className="">
                        {
                            isGenerating ? 
                            <Loader2Icon className="size-7 animate-spin text-white p-1.5"/> :
                            <SendIcon className="text-white size-7 p-1.5" />    
                        }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}