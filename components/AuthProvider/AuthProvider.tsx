"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { checkSession, getMe } from "../../lib/api/clientApi";
import { useAuthStore } from "../../lib/store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const setUser = useAuthStore((state) => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  useEffect(() => {
    const verifySession = async () => {
      try {
        const session = await checkSession();

        if (session) {
          const user = await getMe();
          setUser(user);
        } else {
          clearIsAuthenticated();
        }
      } catch {
        clearIsAuthenticated();
      }
    };

    verifySession();
  }, [setUser, clearIsAuthenticated]);

  return <>{children}</>;
}
