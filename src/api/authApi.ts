const API_BASE = import.meta.env.VITE_API_BASE_URL;
const AUTH_BASE = `${API_BASE}/auth`;

// TYPES

export type AuthResponse = {
    accessToken: string;
    refreshToken: string;
};

export type TokenResponse = {
    accessToken: string;
    refreshToken?: string;
};

// STORAGE KEYS

const ACCESS_KEY = "accessToken";
const REFRESH_KEY = "refreshToken";

// TOKEN STORAGE

export const saveTokens = (tokens: AuthResponse) => {
    localStorage.setItem(ACCESS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
};

export const getAccessToken = (): string | null =>
    localStorage.getItem(ACCESS_KEY);

export const getRefreshToken = (): string | null =>
    localStorage.getItem(REFRESH_KEY);

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
};

// HELPERS

const handleResponse = async (res: Response) => {
    if (!res.ok) {
        let message = "Request failed";

        try {
            const data = await res.json();
            message = data?.message || message;
        } catch {
            try {
                const text = await res.text();
                if (text) message = text;
            } catch { }
        }

        const err = new Error(message);
        (err as any).status = res.status;
        throw err;
    }

    return res.json();
};

// AUTH API

export const registerUser = async (data: {
    username: string;
    email: string;
    password: string;
}) => {
    const res = await fetch(`${AUTH_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    return handleResponse(res);
};

export const loginUser = async (data: {
    email: string;
    password: string;
}) => {
    const res = await fetch(`${AUTH_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });

    const result: AuthResponse = await handleResponse(res);

    saveTokens(result);
    return result;
};

export const refreshToken = async (refresh: string) => {
    const res = await fetch(`${AUTH_BASE}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
    });

    const result: TokenResponse = await handleResponse(res);

    const newTokens: AuthResponse = {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken ?? refresh,
    };

    saveTokens(newTokens);

    return newTokens;
};

// LOGOUT
export const logoutUser = async () => {
    try {
        const { http } = await import("@/api/httpClient");

        await http.post("/auth/logout");
    } catch (err) {
        console.error("Logout failed:", err);
    } finally {
        clearTokens();
    }
};