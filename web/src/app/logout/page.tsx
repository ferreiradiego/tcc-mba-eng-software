"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => {
    sessionStorage.removeItem("token");
    router.replace("/auth");
  }, [router]);
  return null;
}
