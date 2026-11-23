import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = "Chargement des données en direct...", className = "" }: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 gap-3 text-secondary/60 ${className}`}>
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-secondary/10 border-t-accent animate-spin" />
        <Loader2 className="w-5 h-5 text-accent absolute animate-pulse" />
      </div>
      <p className="text-xs font-semibold tracking-wide text-secondary/70 animate-pulse">{text}</p>
    </div>
  );
}

export function TimetableLoadingSkeleton() {
  return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[360px] space-y-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-secondary">Synchronisation de l&apos;emploi du temps...</p>
        <p className="text-xs text-secondary/50">Récupération des séances en temps réel depuis la base de données</p>
      </div>
      <div className="w-48 h-1.5 bg-secondary/10 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-accent rounded-full animate-pulse w-3/4" />
      </div>
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full p-4 space-y-3 animate-pulse">
      <div className="flex items-center justify-between pb-2 border-b border-secondary/10">
        <div className="h-4 bg-secondary/10 rounded w-1/4" />
        <div className="h-4 bg-secondary/10 rounded w-16" />
      </div>
      <div className="space-y-2.5">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-3 py-2 border-b border-secondary/5">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-3.5 bg-secondary/10 rounded"
                style={{ width: `${Math.max(15, 100 / cols - 5)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
