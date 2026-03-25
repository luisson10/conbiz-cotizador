import { NextResponse } from "next/server";

const BANXICO_FIX_URL = "https://www.banxico.org.mx/apps/dao-web/4/52/Fix48.html";
const FALLBACK_FIX_RATE = 17.6543;

function getFallbackDate(): string {
  return new Date().toLocaleDateString("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function extractFixRate(html: string) {
  const normalized = html.replace(/\s+/g, " ");
  const patterns = [
    // "es de 17.8047" — directly targets the rate value after "es de"
    /es\s+de\s+([0-9]{1,2}\.[0-9]{4})/i,
    // "FIX ... 17.8047" — allows digits (dates) in between
    /FIX.{0,120}?([0-9]{1,2}\.[0-9]{4})/i,
    // "17.8047 pesos"
    /([0-9]{1,2}\.[0-9]{4})\s*pesos/i,
    // "Dólar ... 17.8047"
    /D[oó]lar.{0,160}?([0-9]{1,2}\.[0-9]{4})/i,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      return Number.parseFloat(match[1]);
    }
  }

  return null;
}

function extractFixDate(html: string) {
  const normalized = html.replace(/\s+/g, " ");
  const match = normalized.match(
    /(?:para el d[ií]a|publicado el d[ií]a)\s+([0-9]{1,2}\s+de\s+[a-záéíóú]+\s+de\s+[0-9]{4})/i,
  );
  return match ? match[1] : null;
}

export async function GET() {
  try {
    const response = await fetch(BANXICO_FIX_URL, {
      next: { revalidate: 43200 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ConbizCotizador/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json({
        rate: FALLBACK_FIX_RATE,
        date: getFallbackDate(),
        source: "Banxico FIX",
        fallback: true,
      });
    }

    const html = await response.text();
    const rate = extractFixRate(html);
    const date = extractFixDate(html);

    if (!rate) {
      return NextResponse.json({
        rate: FALLBACK_FIX_RATE,
        date: date ?? getFallbackDate(),
        source: "Banxico FIX",
        fallback: true,
      });
    }

    return NextResponse.json({
      rate,
      date: date ?? getFallbackDate(),
      source: "Banxico FIX",
      fallback: false,
    });
  } catch {
    return NextResponse.json({
      rate: FALLBACK_FIX_RATE,
      date: getFallbackDate(),
      source: "Banxico FIX",
      fallback: true,
    });
  }
}
