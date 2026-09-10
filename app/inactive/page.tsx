import Link from "next/link";

export default async function Inactive({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6">
      <div className="max-w-md text-center">
        <p className="mono mb-5 text-xs text-[var(--muted)]">RELAY / QR</p>
        <p className="mono mb-3 text-4xl font-semibold">{code || "UNKNOWN"}</p>
        <h1 className="mb-3 text-3xl font-semibold">
          This code isn&apos;t configured yet.
        </h1>
        <p className="text-[var(--muted)]">
          This QR code has no active Google Maps review link.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold underline"
        >
          Return home
        </Link>
      </div>
    </main>
  );
}
