"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/src/utlis/utils";

export default function BackButton({
  label = "Back",
  className = "",
  showLabel = true,
  onClick,
}) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={cn(
        "overflow-hidden group inline-flex items-center gap-3 px-5 py-2",
        "bg-white border border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50",
        "rounded-2xl text-sm font-semibold text-zinc-700",
        "transition transform duration-200 ease-out shadow-sm hover:shadow-lg",
        "hover:-translate-y-0.5 active:translate-y-0.5 active:scale-95",
        "focus:outline-none focus:ring-2 focus:ring-emerald-500/40",
        className,
      )}
      aria-label="Go back"
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 transition-colors duration-200 group-hover:bg-emerald-100">
        <ArrowLeft
          className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700"
          strokeWidth={2.5}
        />
      </span>

      {showLabel && (
        <span className="text-emerald-700 group-hover:text-emerald-800 transition-colors duration-200">
          {label}
        </span>
      )}
    </button>
  );
}
