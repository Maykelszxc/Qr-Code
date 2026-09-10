import Link from "next/link";

export default async function Inactive({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
	const { code } = await searchParams;

	return <main className="flex min-h-screen items-center justify-center bg-[var(--paper)] px-6">
		<div className="max-w-md text-center">
			<p className="mono mb-5 text-xs text-[var(--muted)]">RELAY / QR</p>
			{code ? <><p className="mono mb-3 text-4xl font-semibold">{code}</p>
			<h1 className="mb-3 text-3xl font-semibold">This code hasn&apos;t been configured yet.</h1>
			<p className="text-[var(--muted)]">Please check with the person who provided this QR code.</p>
			</> : <><h1 className="mb-3 text-3xl font-semibold">This code isn&apos;t active yet.</h1>
			<p className="text-[var(--muted)]">The card you scanned has been temporarily disabled.</p>
			</>}<Link href="/" className="mt-8 inline-block text-sm font-semibold underline">Return home</Link>
		</div>
	</main>;
}