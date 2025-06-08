"use client";

import { ControlledInput } from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(4, "Senha obrigatória"),
});
type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const methods = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  async function handleLogin(data: LoginForm) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      const jwt = result.token || result.accessToken;
      if (!res.ok || !jwt) {
        setError(
          result.error ||
            result.message ||
            JSON.stringify(result) ||
            "Credenciais inválidas"
        );
        throw new Error(
          result.error || result.message || "Credenciais inválidas"
        );
      }
      if (typeof window !== "undefined") {
        sessionStorage.setItem("token", jwt);
      }
      router.replace("/dashboard");
    } catch (err) {
      setError((err as Error).message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Login</h1>
      <FormProvider {...methods}>
        <form
          className="space-y-4"
          onSubmit={methods.handleSubmit(handleLogin)}
        >
          <ControlledInput name="email" label="E-mail" type="email" required />
          <ControlledInput
            name="password"
            label="Senha"
            type="password"
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </FormProvider>
    </Card>
  );
}
