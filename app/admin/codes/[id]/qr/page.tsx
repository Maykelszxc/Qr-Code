"use client";
import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import QRCode from "qrcode";
import { createClient } from "@/lib/supabase/browser";

type Code = { short_code: string };

export default function QrPreview({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [code, setCode] = useState<Code | null>(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const { data, error: loadError } = await createClient()
        .from("qr_codes")
        .select("short_code")
        .eq("id", id)
        .single();
      if (loadError || !data) {
        setError(loadError?.message ?? "Code not found.");
        return;
      }
      const loadedCode = data as Code;
      setCode(loadedCode);
      setImage(
        await QRCode.toDataURL(
          `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/r/${loadedCode.short_code}`,
          { width: 800, margin: 2, errorCorrectionLevel: "M" },
        ),
      );
    }
    void load();
  }, [id]);

  if (error)
    return (
      <div className="p-6 md:p-10">
        <Link href="/admin" className="text-sm text-[var(--muted)] underline">
          &lt;- Inventory
        </Link>
        <p className="mt-10 text-sm text-red-700">{error}</p>
      </div>
    );
  if (!code || !image)
    return (
      <div className="p-6 text-sm text-[var(--muted)] md:p-10">
        Loading QR code...
      </div>
    );

  return (
    <main className="grain min-h-screen p-6 md:p-10">
      <Link
        href={`/admin/codes/${id}`}
        className="text-sm text-[var(--muted)] underline"
      >
        &lt;- Code detail
      </Link>
      <section className="mx-auto mt-10 max-w-md border border-[var(--line)] bg-white p-8 text-center">
        <p className="mono mb-3 text-xs text-[var(--muted)]">QR CODE</p>
        <h1 className="mono text-3xl font-semibold">{code.short_code}</h1>
        <Image
          src={image}
          alt={`QR code for ${code.short_code}`}
          width={800}
          height={800}
          unoptimized
          className="mx-auto my-8 aspect-square w-full max-w-xs"
        />
        <a
          href={image}
          download={`${code.short_code}.png`}
          className="inline-block bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white"
        >
          Download PNG
        </a>
      </section>
    </main>
  );
}
