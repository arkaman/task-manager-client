import { http } from "@/api/httpClient";

export const getCurrentUser = async () => {
    try {
        return await http.get("/auth/me");
    } catch (err: any) {
        throw new Error(err?.message || "Failed to fetch user");
    }
};