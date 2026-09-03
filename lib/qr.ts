import QRCode from "qrcode";

export function qrUrl(code: string) {
  return `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/r/${code}`;
}

export async function generateQrPng(code: string) {
  return QRCode.toBuffer(qrUrl(code), { type: "png", width: 800, margin: 2, errorCorrectionLevel: "M" });
}
