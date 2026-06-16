import { cn } from "@/src/utlis/utils";
import { Folder } from "lucide-react";

export default function EmptyState({
  icon: Icon = Folder,
  title = "No Modules Created",
  message = "Create your first module to start adding videos.",
  buttonText = "Create Module",
  onButtonClick,
  className = "",
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-14 md:py-16 px-6",
        "bg-slate-800/20 border border-dashed border-slate-700/50 rounded-3xl",
        className,
      )}
    >
      <div className="mb-5 md:mb-6">
        <Icon size={44} className="text-slate-500 md:size-12 transition-all" />
      </div>

      <h3 className="text-base md:text-lg font-black uppercase tracking-widest text-slate-400 text-center">
        {title}
      </h3>

      <p className="text-xs md:text-sm text-slate-500 mt-2 text-center max-w-xs md:max-w-sm font-medium">
        {message}
      </p>

      {onButtonClick && (
        <button
          onClick={onButtonClick}
          className={cn(
            "mt-7 md:mt-8 bg-purple-600 hover:bg-purple-700 active:bg-purple-800",
            "px-5 md:px-7 py-3 rounded-2xl font-black uppercase text-[10px] md:text-xs",
            "tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-500/30",
          )}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}
