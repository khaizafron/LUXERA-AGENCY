export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse<T> =
  | { data: T; error: null }
  | { data: null; error: string };

async function handleJson<T>(res: Response): Promise<ApiResponse<T>> {
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    return {
      data: null,
      error: typeof payload.error === "string" ? payload.error : "Request failed",
    };
  }

  return { data: payload, error: null };
}

export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: AuthUser }>> {
  const res = await fetch("/api/local-auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  return handleJson(res);
}

export async function loginUser(input: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ user: AuthUser }>> {
  const res = await fetch("/api/local-auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    credentials: "include",
  });

  return handleJson(res);
}

export async function logoutUser(): Promise<boolean> {
  const res = await fetch("/api/local-auth/session", {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

export async function fetchSession(): Promise<AuthUser | null> {
  const res = await fetch("/api/local-auth/session", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    return null;
  }

  const payload = await res.json().catch(() => ({ user: null }));
  return payload.user ?? null;
}
