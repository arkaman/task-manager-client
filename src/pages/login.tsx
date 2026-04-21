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

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm onSubmit={handleLogin} />
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-muted lg:block">
                <img
                    src="image.webp"
                    alt="Login visual"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}