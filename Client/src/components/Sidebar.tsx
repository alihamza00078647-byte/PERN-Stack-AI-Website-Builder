import { BotIcon, UserIcon } from "lucide-react";
import type { Message, Project } from "../Types"


interface SidebarProps {
    isMenuOpen : Boolean,
    project: Project,
    setProject: (project: Project) => void;
    isGenerating : Boolean,
    setIsGenerating: (isGenerating: Boolean) => void;


}

export default function Sidebar({project, setProject, setIsGenerating, isGenerating, isMenuOpen}: SidebarProps) {
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
                                <div key={msg.id} className={`flex items-center gap-3 ${isUser? "justify-end": "justify-start"}`}>
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
                                <div key={ver.id} className="">

                                </div>
                            )
                        }
                    })}
                </div>
                {/* -------- Input Area   -------- */}
                <form></form>
            </div>
        </div>
    )
}