import { forwardRef, useRef } from "react"
import type { Project } from "../Types";
import { iframeScript } from "../assets/assets";

interface ProjectPreviewProps {
    project: Project;
    isGenerating: boolean;
    device? : 'desktop' | 'tablet' | 'phone';
    showEditorPanel : boolean;

}

export interface ProjectPreviewRef {
    getCode : () => string | undefined;
}


export default forwardRef(function ProjectPreview({project, isGenerating, device = "desktop", showEditorPanel = true}, ref) {
    
    const iframeRef = useRef<HTMLIFrameElement>(null)
    
    // Different screen sizes
    const resolution = {
        phone : "w-[412px]",
        tablet : "w-[768px]",
        desktop : "w-full",
    }


    const injectPreview = (html:string) => {
        if (!html) return "";
        if (!showEditorPanel) return html;
        
        if (html.includes('</body>')) {
            return html.replace('</body>', iframeScript + "</body>")
        } else {
            return html + iframeScript;
        }
    }

    return (
        <div className="relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2">
            {project.current_code ? (
                <>
                  <iframe ref={iframeRef} 
                  srcDoc={injectPreview(project.current_code)} 
                  className={`h-full max-sm:w-full ${resolution[device]} mx-auto transition-all`}
                  />
                </>
            ) : isGenerating && (
                <div>
                    Loading
                </div>
            )}
        </div>
    )
})