"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { CodeTable } from "./code-table";

type Code = {
  id: string;
  short_code: string;
  business_name: string | null;
  status: string;
  target_url: string | null;
  created_at: string;
  scan_events: { scanned_at: string }[];
};
export default function Dashboard() {
  const [codes, setCodes] = useState<Code[]>([]);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    createClient()
      .from("qr_codes")
      .select("*, scan_events(scanned_at)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setCodes((data as Code[]) ?? []));
  }, []);
  const shown =
    filter === "all" ? codes : codes.filter((code) => code.status === filter);
  const counts = {
    all: codes.length,
    active: codes.filter((c) => c.status === "active").length,
    unassigned: codes.filter((c) => c.status === "unassigned").length,
    disabled: codes.filter((c) => c.status === "disabled").length,
  };
  return (
    <div className="p-6 md:p-10">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mono mb-3 text-xs text-[var(--muted)]">
            INVENTORY / OVERVIEW
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Your codes.</h1>
        </div>
        <Link
          href="/admin/generate"
          className="bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0e392c]"
        >
          + Generate batch
        </Link>
      </header>
      <div className="mb-6 grid grid-cols-2 border-y border-[var(--line)] sm:grid-cols-4">
        {(["all", "active", "unassigned", "disabled"] as const).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`border-r border-[var(--line)] px-4 py-4 text-left ${filter === key ? "bg-[var(--lime)]" : ""}`}
          >
            <span className="mono block text-2xl">{counts[key]}</span>
            <span className="text-xs capitalize text-[var(--muted)]">
              {key}
            </span>
          </button>
        ))}
      </div>
      <CodeTable
        codes={shown}
        onDeleted={(id) =>
          setCodes((current) => current.filter((code) => code.id !== id))
        }
      />
    </div>
  );
}
