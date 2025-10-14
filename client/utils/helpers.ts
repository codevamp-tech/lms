import { jwtDecode } from "jwt-decode";

export const setCookie = (param: string, token: string) => {
  const cookieValue = token;
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // Cookie expires in 7 days
  document.cookie = `${param}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; secure; SameSite=lax`;
};

export const getTokenFromCookies = (): string | null => {
  if (typeof document === "undefined") {
    return null;
  }
  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) => cookie.startsWith("token="));
  return tokenCookie ? tokenCookie.split("=")[1] : null;
};

export const getUserIdFromToken = (): string | null => {
  const token = getTokenFromCookies();
  if (!token) {
    return null;
  }

  try {
    const decodedToken: { id: string; exp: number } = jwtDecode(token);
    return decodedToken.id;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
