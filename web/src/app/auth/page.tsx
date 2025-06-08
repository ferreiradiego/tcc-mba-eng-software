"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Chamada ao endpoint de login do gateway
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      // Aceita token ou accessToken
      const jwt = data.token || data.accessToken;
      if (!res.ok || !jwt) {
        setError(
          data.error || data.message || JSON.stringify(data) || "Credenciais inválidas"
        );
        throw new Error(data.error || data.message || "Credenciais inválidas");
      }
      // Salvar token no sessionStorage
      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", jwt);
      }
      // Redirecionar
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("refreshToken");
      fetch("/api/auth/logout", { method: "POST" }); // Remove cookies no backend
      router.push("/auth");
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <form className="space-y-4" onSubmit={handleLogin}>
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
        </div>
        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Card>
  );
}
