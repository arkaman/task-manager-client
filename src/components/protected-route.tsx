import { Navigate } from "react-router-dom";
import { getAccessToken } from "@/api/authApi";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const token = getAccessToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}