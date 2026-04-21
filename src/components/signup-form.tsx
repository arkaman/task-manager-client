import { useState } from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom";
import { CircleAlert } from "lucide-react";

type SignupFormProps = Omit<React.ComponentProps<"form">, "onSubmit"> & {
  onSubmit: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void | Promise<void>;
};

export function SignupForm({ className, onSubmit, ...props }: SignupFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      await onSubmit({
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        {/* HEADER */}
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-sm text-muted-foreground">
            Fill in the form below to create your account
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg text-red-700">
            <CircleAlert />
            <span className="text-red-600">{error}</span>
          </div>
        )}

        {/* USERNAME */}
        <Field>
          <FieldLabel htmlFor="name">Username</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="username"
            required
            className="bg-background"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Field>

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            className="bg-background"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="password"
            required
            className="bg-background"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FieldDescription>
            Must be at least 6 characters long.
          </FieldDescription>
        </Field>

        {/* CONFIRM PASSWORD */}
        <Field>
          <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            className="bg-background"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FieldDescription>
            Please confirm your password.
          </FieldDescription>
        </Field>

        {/* SUBMIT */}
        <Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </Field>

        {/* FOOTER */}
        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account?{" "}
            <Link to="/login" className="underline-offset-4">
              Sign in
            </Link>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}