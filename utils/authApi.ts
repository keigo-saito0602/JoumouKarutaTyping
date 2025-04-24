export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    const config = useRuntimeConfig();

    const res = await $fetch<AuthResponse>(`${config.public.apiBase}/login`, {
      method: "POST",
      body: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return res;
  } catch (error: any) {
    throw new Error(error?.data?.message || "ログインに失敗しました");
  }
};

export const signup = async (payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const config = useRuntimeConfig();

  const res = await $fetch<AuthResponse>(`${config.public.apiBase}/users`, {
    method: "POST",
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
};
