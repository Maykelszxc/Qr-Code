"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    const { error } = await createClient().auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else router.push("/admin");
  }
  return (
    <main className="grain flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-md border border-[var(--line)] bg-[var(--paper)] p-8 shadow-[8px_8px_0_var(--green)]"
      >
        <p className="mono mb-12 text-xs text-[var(--muted)]">
          RELAY / QR ADMIN
        </p>
        <h1 className="mb-2 text-3xl font-semibold">Welcome back.</h1>
        <p className="mb-8 text-sm text-[var(--muted)]">
          Your private inventory console.
        </p>
        <label className="mb-4 block text-sm">
          Email
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 block w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--green)]"
          />
        </label>
        <label className="mb-6 block text-sm">
          Password
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 block w-full border border-[var(--line)] bg-white px-3 py-3 outline-none focus:border-[var(--green)]"
          />
        </label>
        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
        <button className="w-full bg-[var(--green)] px-4 py-3 font-semibold text-white hover:bg-[#0e392c]">
          Sign in
        </button>
      </form>
    </main>
  );
}
