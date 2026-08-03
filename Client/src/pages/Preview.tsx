import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyProjects } from "../assets/assets";
import { Loader2Icon } from "lucide-react";
import type { Project } from "../Types";
import ProjectPreview from "../components/ProjectPreview";

export default function Preview() {
  const { projectId, versionId } = useParams();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCode = () => {
    setTimeout(() => {
      const code = dummyProjects.find(
        (project) => project.id === projectId,
      )?.current_code;
      if (code) {
        setCode(code);
        setLoading(false);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchCode();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-center h-screen">
          <Loader2Icon className="size-7 animate-spin text-indigo-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
        {code && <ProjectPreview isGenerating={false} showEditorPanel={false} project={{current_code: code} as Project}/>}
    </div>
  );
}
