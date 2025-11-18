"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchSession, logoutUser, type AuthUser } from "@/lib/auth";

type SessionPayload = { user: AuthUser };

export const authClient = {
  async signOut(): Promise<{ error: string | null }> {
    const ok = await logoutUser();
    return { error: ok ? null : "Failed to sign out" };
  },
};

export function useSession() {
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const readSession = useCallback(async () => {
    setPending(true);
    try {
      const user = await fetchSession();
      setSession(user ? { user } : null);
      setError(null);
    } catch (err) {
      setSession(null);
      setError(err as Error);
    } finally {
      setPending(false);
    }
  }, []);

  useEffect(() => {
    readSession();
  }, [readSession]);

  return { data: session, isPending: pending, error, refetch: readSession };
}
