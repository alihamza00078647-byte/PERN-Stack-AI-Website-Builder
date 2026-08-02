import {
  CircleIcon,
  ScanLineIcon,
  SquareIcon,
  TriangleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const steps = [
  { icon: ScanLineIcon, label: "Analyzing your Request...." },
  { icon: SquareIcon, label: "Generating layout Structure...." },
  { icon: TriangleIcon, label: "Assembling UI design...." },
  { icon: CircleIcon, label: "Finalize your Website ...." },
];

const STEP_DURATION = 45000;

export default function LoaderSteps() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s) => (s + 1) % steps.length);
    }, STEP_DURATION);

    return clearInterval(interval);
  }, []);

  const Icon = steps[current].icon;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 from-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse"></div>
      <div className="relative z-10 h-32 w-32 flex items-center justify-center">
        <div className="absolute inset-0 animate-ping opacity-30 rounded-full border border-indigo-400" />
        <div className="absolute inset-4 rounded-full border border-purple-400/20" />
        <Icon className="w-8 h-8 text-white animate-bounce opacity-80" />
      </div>
      {/* ---- Step Label ** fade using transition only (no invisible start) **---- */}

      <p
        key={current}
        className="mt-8 text-lg text-white/90 font-light tracking-wide transition-all ease-in-out duration-700 opacity-100"
      >
        {steps[current].label}
      </p>
      <p className="text-xs text-gray-400 transition-opacity mt-2 duration-700 opacity-100">
        This may take Some minutes to Create.
      </p>
    </div>
  );
}
