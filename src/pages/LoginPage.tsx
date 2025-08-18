import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFields, loginSchema } from "../api/login.ts";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { Label } from "../components/ui/label.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFields) => {
    try {
      await loginUser(data);
      toast.success("Login successfully");
      navigate("/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <>
      <div className="items-center justify-center bg-offwhite/80 sm:px-6 lg:px-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-sm mx-auto p-8 space-y-4 border-2 border-eggshell/30 rounded bg-offwhite/80 my-12"
        >
          <h1 className="text-purple text-xl">Already a spotter?</h1>
          <div>
            <Label htmlFor="username" className="mb-1">
              Username
            </Label>
            <Input
              id="username"
              autoFocus
              {...register("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className="text-cf-dark-red">{errors.username.message}</div>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoFocus
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className="text-cf-dark-red">{errors.password.message}</div>
            )}
          </div>

          <Button
            type="submit"
            {...({
              disabled: isSubmitting,
            } as React.ButtonHTMLAttributes<HTMLButtonElement>)}
          >
            {isSubmitting ? "Logging ..." : "Login"}
          </Button>
          <p className="text-center">OR</p>
          <Link
            className="text-purple font-sans hover:text-purple/70"
            to="/register"
          >
            Register here
          </Link>
        </form>
      </div>
    </>
  );
}
