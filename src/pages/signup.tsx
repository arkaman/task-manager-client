import { SignupForm } from "@/components/signup-form";
import { registerUser } from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

        toast.success("Account created successfully");

        // flow control
        navigate("/login");
    };

    return <SignupForm onSubmit={handleSignup} />;
}