import type { Project } from "../Types"


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

                </div>
                {/* -------- Input Area   -------- */}
                <form></form>
            </div>
        </div>
    )
}