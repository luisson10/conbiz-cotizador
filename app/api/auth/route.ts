import { NextRequest, NextResponse } from "next/server";

import {
  buildExpiredSessionCookie,
  buildSessionCookie,
  createSessionToken,
  verifySessionToken,
  type Role,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const { password } = body;
  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "Se requiere contraseña." }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  const userPassword = process.env.USER_PASSWORD;

  let role: Role | null = null;
  if (adminPassword && password === adminPassword) {
    role = "admin";
  } else if (userPassword && password === userPassword) {
    role = "user";
  }

  if (!role) {
    return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });
  }

  const token = await createSessionToken(role);
  const response = NextResponse.json({ authenticated: true, role });
  response.headers.set("Set-Cookie", buildSessionCookie(token));
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });
  response.headers.set("Set-Cookie", buildExpiredSessionCookie());
  return response;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("auth_session")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  const session = await verifySessionToken(token);
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({ authenticated: true, role: session.role });
}
