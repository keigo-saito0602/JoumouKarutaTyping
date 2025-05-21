const TOKEN_COOKIE_KEY = "token";

export const getTokenFromCookie = (): string | null => {
  const token = useCookie<string>(TOKEN_COOKIE_KEY);
  return token?.value || null;
};

export const setTokenToCookie = (token: string): void => {
  const tokenCookie = useCookie<string>(TOKEN_COOKIE_KEY, {
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
    secure: true,
  });

  tokenCookie.value = token;
};

export const clearTokenCookie = (): void => {
  const tokenCookie = useCookie<string>(TOKEN_COOKIE_KEY);
  tokenCookie.value = "";
};
