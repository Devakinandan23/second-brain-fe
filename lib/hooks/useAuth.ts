"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

const TOKEN_KEY = "sb_token";
const USERNAME_KEY = "sb_username";

export function useAuth() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUsername = localStorage.getItem(USERNAME_KEY);
    setToken(storedToken);
    setUsername(storedUsername);
    setIsLoading(false);
  }, []);

  const login = useCallback(
    (newToken: string, newUsername: string) => {
      localStorage.setItem(TOKEN_KEY, newToken);
      localStorage.setItem(USERNAME_KEY, newUsername);
      setToken(newToken);
      setUsername(newUsername);
      router.push("/dashboard");
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
    setToken(null);
    setUsername(null);
    router.push("/signin");
  }, [router]);

  const isAuthenticated = !!token;

  return { token, username, isAuthenticated, isLoading, login, logout };
}
