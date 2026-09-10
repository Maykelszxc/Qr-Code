import Link from "next/link";
import { SignOut } from "./sign-out";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col border-r border-[var(--line)] bg-[var(--green)] px-6 py-7 text-white">
        <Link href="/admin" className="mb-12 text-xl font-bold tracking-tight">
          relay<span className="text-[var(--lime)]">/</span>qr
        </Link>
        <nav className="space-y-1 text-sm">
          <Link
            className="block rounded px-3 py-2 hover:bg-white/10"
            href="/admin"
          >
            Inventory
          </Link>
          <Link
            className="block rounded px-3 py-2 hover:bg-white/10"
            href="/admin/generate"
          >
            Generate batch
          </Link>
        </nav>
        <div className="mt-auto pt-10 text-xs text-white/55">
          <p className="mono mb-4">PRIVATE ADMIN</p>
          <SignOut />
        </div>
      </aside>
      <main className="min-w-0">{children}</main>
    </div>
  );
}
