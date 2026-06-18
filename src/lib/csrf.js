const CSRF_TOKEN_KEY = "x-csrf-token";

let csrfToken = null;

export const setCsrfToken = (token) => {
  csrfToken = token;
  if (typeof window !== "undefined") {
    sessionStorage.setItem(CSRF_TOKEN_KEY, token);
  }
};

export const getCsrfToken = () => {
  if (csrfToken) return csrfToken;
  if (typeof window !== "undefined") {
    csrfToken = sessionStorage.getItem(CSRF_TOKEN_KEY);
  }
  return csrfToken;
};

export const clearCsrfToken = () => {
  csrfToken = null;
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(CSRF_TOKEN_KEY);
  }
};

export const generateCsrfToken = () => {
  const array = new Uint8Array(32);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array);
  } else {
    for (let i = 0; i < 32; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  const token = Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
  setCsrfToken(token);
  return token;
};

export const getCsrfHeaders = () => {
  const token = getCsrfToken() || generateCsrfToken();
  return { [CSRF_TOKEN_KEY]: token };
};
