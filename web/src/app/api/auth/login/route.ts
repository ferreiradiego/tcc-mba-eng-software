import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    // Chama o endpoint do gateway (ajuste a URL se necessário)
    const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000"}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Credenciais inválidas" }, { status: 401 });
    }
    // Seta o token e refreshToken nos cookies HttpOnly
    const jwt = data.token || data.accessToken;
    const refresh = data.refreshToken;
    const response = NextResponse.json(data);
    if (jwt) {
      response.cookies.set("token", jwt, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutos
      });
    }
    if (refresh) {
      response.cookies.set("refreshToken", refresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }
    return response;
  } catch (err) {
    console.error("Erro ao autenticar:", err);
    return NextResponse.json({ error: "Erro ao autenticar" }, { status: 500 });
  }
}
