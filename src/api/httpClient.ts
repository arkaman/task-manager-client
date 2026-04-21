const API_BASE = import.meta.env.VITE_API_BASE_URL;

import {
    getAccessToken,
    getRefreshToken,
    refreshToken,
    clearTokens,
} from "@/api/authApi";

// refresh state
let isRefreshing = false;
let refreshPromise: Promise<any> | null = null;

// helper
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

    if (res.status === 204) return null;

    return res.json();
};

// core
const fetchWithAuth = async (
    url: string,
    options: RequestInit = {},
    retry = true
): Promise<any> => {

    const makeRequest = async () => {
        const token = getAccessToken();

        return fetch(url, {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        });
    };

    let res = await makeRequest();

    // success path
    if (res.status !== 401) {
        return handleResponse(res);
    }

    // stop infinite retry
    if (!retry) {
        clearTokens();
        throw new Error("Session expired");
    }

    const refresh = getRefreshToken();

    if (!refresh) {
        clearTokens();
        throw new Error("Session expired");
    }

    // one refresh at a time
    if (!isRefreshing) {
        isRefreshing = true;

        refreshPromise = refreshToken(refresh)
            .catch((err) => {
                clearTokens();
                throw err;
            })
            .finally(() => {
                isRefreshing = false;
            });
    }

    try {
        await refreshPromise;
    } catch {
        throw new Error("Session expired");
    }

    // retry once with new token
    res = await fetchWithAuth(url, options, false);

    return res;
};

// API

export const http = {
    get: (endpoint: string) =>
        fetchWithAuth(`${API_BASE}${endpoint}`),

    post: (endpoint: string, body?: any) =>
        fetchWithAuth(`${API_BASE}${endpoint}`, {
            method: "POST",
            body: body ? JSON.stringify(body) : undefined,
        }),

    put: (endpoint: string, body?: any) =>
        fetchWithAuth(`${API_BASE}${endpoint}`, {
            method: "PUT",
            body: body ? JSON.stringify(body) : undefined,
        }),

    del: (endpoint: string) =>
        fetchWithAuth(`${API_BASE}${endpoint}`, {
            method: "DELETE",
        }),
};