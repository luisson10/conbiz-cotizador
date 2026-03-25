"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Role = "user" | "admin";

interface UseAuthReturn {
  role: Role | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth");
        const data = await res.json();
        if (!ignore) {
          if (data.authenticated && data.role) {
            setRole(data.role);
          } else {
            setRole(null);
          }
        }
      } catch {
        if (!ignore) setRole(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    void checkSession();
    return () => {
      ignore = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      if (data.authenticated && data.role) {
        setRole(data.role);
      } else {
        setRole(null);
      }
    } catch {
      setRole(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth", { method: "DELETE" });
    } finally {
      setRole(null);
      router.push("/login");
    }
  }, [router]);

  return { role, loading, refresh, logout };
}
