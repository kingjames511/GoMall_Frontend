const TOKEN_KEY = "gomall_auth_token";

export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to save token to localStorage:", error);
  }
};


export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get token from localStorage:", error);
    return null;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove token from localStorage:", error);
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
