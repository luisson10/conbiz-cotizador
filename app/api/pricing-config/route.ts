import { NextRequest, NextResponse } from "next/server";

import { verifySessionToken } from "@/lib/auth";
import { normalizePricingConfig } from "@/lib/pricing";
import { readPricingConfig, writePricingConfig } from "@/lib/pricing-config-storage";
import { validatePricingConfig } from "@/lib/pricing-validation";

export async function GET() {
  const pricing = await readPricingConfig();
  return NextResponse.json(pricing);
}

export async function PUT(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  if (!token) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const session = await verifySessionToken(token);
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido en el cuerpo de la solicitud." }, { status: 400 });
  }

  const result = validatePricingConfig(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Datos de configuración inválidos.", details: result.error.flatten().fieldErrors },
      { status: 422 },
    );
  }

  try {
    const pricing = await writePricingConfig(normalizePricingConfig(result.data));
    return NextResponse.json(pricing);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la configuración." }, { status: 500 });
  }
}

