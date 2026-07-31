import { useEffect, useState } from "react"
import type { Project } from "../Types";
import { Loader2Icon, PlusIcon } from "lucide-react";



export default function Myprojects() {

    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchProjects = async () => {

    }

    useEffect(() => {
        fetchProjects();
    }, [])


    return (
        <div className="px-4 ms:px-16 lg:px-24 xl:px-32">
            {loading ? 
            <div  className="flex justify-center items-center h-[80vh]">
                <Loader2Icon className="animate-span size-7 text-indigo-200"/>
            </div> : 
            projects.length > 0 ? 
            <div className="py-10 min-h-[80vh]">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl text-white font-medium">My Projects</h1>
                    <button className="flex items-center gap-2 text-white px-3"> 
                        <PlusIcon size={18} /> Create New 
                    </button>
                </div>
            </div>: 
            <div></div>
            }
        </div>
    )
}