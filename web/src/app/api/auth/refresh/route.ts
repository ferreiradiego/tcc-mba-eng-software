import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Recebe o refreshToken do cookie
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "Refresh token não encontrado" }, { status: 401 });
  }
  try {
    // Chama o endpoint do gateway para refresh
    const res = await fetch(`${process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:3000"}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data.message || "Refresh inválido" }, { status: 401 });
    }
    // Atualiza o token e refreshToken nos cookies
    const jwt = data.token || data.accessToken;
    const newRefresh = data.refreshToken;
    const response = NextResponse.json(data);
    if (jwt) {
      response.cookies.set("token", jwt, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 minutos
      });
    }
    if (newRefresh) {
      response.cookies.set("refreshToken", newRefresh, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 dias
      });
    }
    return response;
  } catch (err) {
    console.error("Erro ao autenticar:", err);
    return NextResponse.json({ error: "Erro ao renovar token" }, { status: 500 });
  }
}
