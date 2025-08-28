import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFields, loginSchema } from "../api/login.ts";
import { Input } from "../components/ui/input.tsx";
import { Button } from "../components/ui/button.tsx";
import { Label } from "../components/ui/label.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

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
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed...");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] py-8">
      <div className="w-full max-w-md mx-4">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 border-2 border-eggshell/30 rounded-lg bg-offwhite/80 shadow-lg"
        >
          <h1 className="text-2xl font-logo font-bold text-purple text-center">
            Already a spotter?
          </h1>

          <div>
            <Label htmlFor="username" className="block mb-2">
              Username
            </Label>
            <Input
              className="w-full hover:border-eggshell"
              id="username"
              autoFocus
              {...register("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <div className="text-rose-800 text-sm mt-1">
                {errors.username.message}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="block mb-2">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              className="w-full hover:border-eggshell"
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <div className="text-rose-800 text-sm mt-1">
                {errors.password.message}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>

          <p className="text-center text-gray-600">OR</p>

          <Link
            className="block text-center text-purple font-sans hover:text-purple/70 border border-purple hover:border-eggshell rounded-md py-2 shadow-soft transition-colors"
            to="/users/register"
          >
            Register here
          </Link>
        </form>
      </div>
    </div>
  );
}
