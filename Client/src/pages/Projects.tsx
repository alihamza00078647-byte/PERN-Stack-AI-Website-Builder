import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom"
import type { Project } from "../Types";
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, LoaderIcon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from "lucide-react";
import { dummyConversations, dummyProjects } from "../assets/assets";



export default function Projects() {

    const {projectId} = useParams();
    const navigate = useNavigate();
    
    const [project, setProject]  = useState<Project | null>(null);
    const [loading, setLoading]  = useState(true);
    const [isGenerating, setIsGenerating]  = useState(true);
    const [device, setDevice]  = useState<'phone' | 'tablet' | 'desktop'>('desktop');
    const [isMenuOpen, setIsMenuOpen]  = useState(false);
    const [isSaving, setIsSaving]  = useState(false);

    const fetchProjects = async () => {
        const project = dummyProjects.find(project => project.id === projectId);

        setTimeout(() => {
            if (project){
                setProject({...project, conversation: dummyConversations});
                setLoading(false);
                setIsGenerating(project.current_code ? false: true);
            }
        }, 2000);
    }

    const saveProject = async () => {

    }

    const downloadCode = () => {

    }

    const togglePushlish = async () => {

    }


    useEffect(() => {
        fetchProjects();
    }, []);


    if (loading) {
        return (
            <>
              <div className="flex items-center justify-center h-screen">
                <Loader2Icon className="size-7 animate-spin text-violet-200" />
              </div>
            </>
        )
    }

    return project ? (
        <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
            {/* Builder Navbar */}
            <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar">
                {/* -----Left ----- */}
                <div className="flex items-center gap-2 text-nowrap sm:min-w-90">
                    <img src="/favicon.svg" alt="logo" className="h-6 cursor-pointer" onClick={() => navigate('/')}/>
                    <div className="max-w-64 sm:max-w-xs">
                      <p className="text-sm font-medium capitalize truncate">{project.name}</p>
                      <p className="text-xs text-gray-500 -mt-0.5">Previewing last saved version</p>
                    </div>
                    <div className="sm:hidden flex-1 flex justify-end">
                        {
                            isMenuOpen ? 
                            <MessageSquareIcon onClick={() => setIsMenuOpen(false)} className="size-6 cursor-pointer" /> : 
                            <XIcon className="size-6 cursor-pointer" onClick={() => setIsMenuOpen(true)}/> 
                        }
                    </div>
                </div>
                {/* -----Middle ----- */}
                <div className="hidden sm:flex bg-gray-950 gap-2 p-1.5 rounded-md">
                    <SmartphoneIcon onClick={() => setDevice('phone')} className={`p-1 size-6 rounded cursor-pointer ${device === "phone" ? "bg-gray-700" : ""}`} />
                    <TabletIcon onClick={() => setDevice('tablet')} className={`p-1 size-6 rounded cursor-pointer ${device === "tablet" ? "bg-gray-700" : ""}`} />
                    <LaptopIcon onClick={() => setDevice('desktop')} className={`p-1 size-6 rounded cursor-pointer ${device === "desktop" ? "bg-gray-700" : ""}`} />
                </div>
                {/* -----Right ----- */}
                <div className="flex items-center justify-end flex-1 text-xs sm:text-sm gap-3">
                    <button onClick={saveProject} disabled={isSaving} className="max-sm:hidden bg-gray-800 hover:bg-gray-700 px-3.5 py-1 text-white flex items-center gap-3 rounded sm:rounded-sm transition-colors border">
                        {isSaving ? <LoaderIcon size={16} className="animate-spin" /> : <SaveIcon size={16} /> } 
                        Save
                    </button>
                    <Link target="_blank" to={`/preview/${projectId}`} className="max-sm:hidden bg-gray-800 hover:bg-gray-700 px-3.5 py-1 text-white flex items-center gap-3 rounded sm:rounded-sm transition-colors border">
                      <FullscreenIcon size={16} /> Preview
                    </Link>
                    <button onClick={downloadCode} className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 px-3.5 py-1 text-white flex items-center gap-3 rounded sm:rounded-sm transition-colors border">
                        <ArrowBigDownDashIcon size={16} /> Download
                    </button>
                    <button onClick={togglePushlish} className="bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 px-3.5 py-1 text-white flex items-center gap-3 rounded sm:rounded-sm transition-colors border">
                        {project.isPublished ? <EyeOffIcon  size={16}/> : <EyeIcon size={16} /> }
                        {project.isPublished ? "Unpublish" : "Publish" }
                    </button>
                </div>
            </div>
           <div className="flex flex-1 overflow-auto">
                <div>Sidebar</div>
                <div className="flex-1 pl-0 p-2">Project Preview</div>
           </div>

        </div>
    ) : (
            <div className="flex items-center justify-center h-screen">
                <p className="text-2xl font-medium text-gray-200">Unable To load Project!</p>
            </div>
        )
}