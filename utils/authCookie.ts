const TOKEN_COOKIE_KEY = "token";

export const getTokenFromCookie = (): string | undefined => {
  const cookie = useCookie<string>(TOKEN_COOKIE_KEY);
  return cookie.value;
};

export const setTokenToCookie = (token: string): void => {
  const cookie = useCookie<string>(TOKEN_COOKIE_KEY);
  cookie.value = token;
};

export const clearTokenCookie = (): void => {
  const cookie = useCookie<string>(TOKEN_COOKIE_KEY);
  cookie.value = "";
};
