"use client";

import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, signout } from "@/lib/api";

const USERNAME_KEY = "sb_username";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(({ user }) => {
        setToken("cookie-session");
        setUsername(user.username);
        localStorage.setItem(USERNAME_KEY, user.username);
      })
      .catch(() => {
        setToken(null);
        setUsername(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    (newToken: string, newUsername: string) => {
      localStorage.setItem(USERNAME_KEY, newUsername);
      setToken(newToken || "cookie-session");
      setUsername(newUsername);
      window.location.href = "/dashboard";
    },
    []
  );

  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await signout();
    } finally {
      localStorage.removeItem("sb_token");
      localStorage.removeItem(USERNAME_KEY);
      setToken(null);
      setUsername(null);
      queryClient.clear();
      window.location.href = "/signin";
    }
  }, [queryClient]);

  const isAuthenticated = !!token;

  return { token, username, isAuthenticated, isLoading, login, logout };
}
