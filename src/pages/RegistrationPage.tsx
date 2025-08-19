import { useForm } from "react-hook-form";
import { RegisterFields, registerSchema } from "../api/register";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export default function RegistrationPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFields) => {
    const payload = {
      ...data,
      isActive: true,
      profileDetailsInsertDTO: {
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
      },
    };
    try {
      const res = await fetch("api/users/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registrartion Failed...");
      }
      toast.success("User registered successfully!");
      navigate("/auth/login");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went Wrong...";
      toast.error(message);
      console.error(err);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto p-8 space-y-6 border-2 border-lilac/50 rounded-xl bg-offwhite/90 shadow-soft mt-12"
      >
        <h1 className="text-2xl text-purple font-logo text-center">
          Welcome new Spotter!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("username")}
              disabled={isSubmitting}
            />
            {errors.username && (
              <p className="text-sm text-rose-800">{errors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("password")}
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-sm text-rose-800">{errors.password.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("firstname")}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("lastname")}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("email")}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              type="date"
              id="dateOfBirth"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("dateOfBirth")}
              disabled={isSubmitting}
            />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              {...register("gender")}
              className="input w-full appearance-none px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NON-BINARY">Non-binary</option>
              <option value="GENDERFLUID">Genderfluid</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              {...register("role")}
              className="input appearance-none w-full px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
              disabled={isSubmitting}
            >
              <option value="" disabled>
                Select
              </option>
              <option value="ADMIN">Admin</option>
              <option value="SPOTTER">Spotter</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-purple/80 hover:bg-purple text-offwhite shadow-soft"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </>
  );
}
