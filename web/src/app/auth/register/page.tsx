"use client";

import { ControlledInput } from "@/components/controlled-fields";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/loginUser";

const RegisterSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().optional(),
});
type RegisterForm = z.infer<typeof RegisterSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const methods = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { name: "", email: "", password: "", role: "" },
  });

  async function handleRegister(data: RegisterForm) {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/auth/register", data);
      setSuccess("Usuário cadastrado com sucesso! Redirecionando...");
      await loginUser({ email: data.email, password: data.password });
      router.replace("/dashboard");
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null) {
        const errorObj = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        setError(
          errorObj?.response?.data?.message ||
            errorObj?.message ||
            "Erro ao cadastrar usuário"
        );
      } else {
        setError("Erro ao cadastrar usuário");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-center">Cadastro</h1>
      <FormProvider {...methods}>
        <form
          className="space-y-4"
          onSubmit={methods.handleSubmit(handleRegister)}
        >
          <ControlledInput name="name" label="Nome" required />
          <ControlledInput name="email" label="E-mail" type="email" required />
          <ControlledInput
            name="password"
            label="Senha"
            type="password"
            required
          />
          <ControlledInput name="role" label="Função (opcional)" />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
          <div className="text-center text-sm mt-2">
            Já tem conta?{" "}
            <button
              type="button"
              className="text-blue-600 hover:underline bg-transparent border-0 p-0 m-0"
              onClick={() => router.push("/auth")}
            >
              Entrar
            </button>
          </div>
        </form>
      </FormProvider>
    </Card>
  );
}
