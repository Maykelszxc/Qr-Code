"use client";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
export function SignOut() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await createClient().auth.signOut();
        router.push("/admin/login");
      }}
      className="text-white/70 hover:text-white"
    >
      Sign out
    </button>
  );
}
