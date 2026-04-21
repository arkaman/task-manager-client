import { SignupForm } from "@/components/signup-form";
import { registerUser } from "@/api/authApi";
import { useNavigate } from "react-router-dom";

type SignupData = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export default function SignupPage() {
    const navigate = useNavigate();

    const handleSignup = async (data: SignupData) => {
        // business logic
        if (data.password !== data.confirmPassword) {
            throw new Error("Passwords do not match");
        }

        await registerUser({
            username: data.username,
            email: data.email,
            password: data.password,
        });

        // flow control
        navigate("/login");
    };

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <SignupForm onSubmit={handleSignup} />
                    </div>
                </div>
            </div>

            <div className="relative hidden bg-muted lg:block">
                <img
                    src="image.webp"
                    alt="Signup visual"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}