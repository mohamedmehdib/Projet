"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { logoutWithSupabase } from "@/lib/supabaseAuth";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    async function handleAutoLogout() {
      try {
        logout();
        await logoutWithSupabase().catch(() => {});
      } finally {
        router.replace("/login");
      }
    }

    handleAutoLogout();
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-primary text-secondary">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm font-semibold text-secondary/70">
          Déconnexion en cours...
        </p>
      </div>
    </div>
  );
}
