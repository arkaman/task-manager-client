import { LoginForm } from "@/components/login-form";
import { loginUser } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

type LoginData = {
    email: string;
    password: string;
};

export default function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = async (data: LoginData) => {
        await loginUser({
            email: data.email.trim(),
            password: data.password,
        });

        navigate("/");
    };

    return <LoginForm onSubmit={handleLogin} />;
}