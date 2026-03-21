import { NextResponse } from "next/server";

const BANXICO_FIX_URL = "https://www.banxico.org.mx/apps/dao-web/4/52/Fix48.html";
const FALLBACK_FIX_RATE = 17.6543;
const FALLBACK_FIX_DATE = "11 de marzo de 2026";

function extractFixRate(html: string) {
  const normalized = html.replace(/\s+/g, " ");
  const patterns = [
    /FIX[^0-9]{0,120}([0-9]{1,2}\.[0-9]{4})/i,
    /D[oó]lar[^0-9]{0,160}([0-9]{1,2}\.[0-9]{4})/i,
    /([0-9]{1,2}\.[0-9]{4})\s*pesos/i,
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
        date: FALLBACK_FIX_DATE,
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
        date: date ?? FALLBACK_FIX_DATE,
        source: "Banxico FIX",
        fallback: true,
      });
    }

    return NextResponse.json({
      rate,
      date,
      source: "Banxico FIX",
      url: BANXICO_FIX_URL,
    });
  } catch {
    return NextResponse.json({
      rate: FALLBACK_FIX_RATE,
      date: FALLBACK_FIX_DATE,
      source: "Banxico FIX",
      fallback: true,
    });
  }
}
