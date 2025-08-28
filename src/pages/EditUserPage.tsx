import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserUpdateDTO, UserReadOnlyDTO } from "../types/userTypes";
import { authFetch } from "../api/client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { z } from "zod";

// Create a specific schema for user updates (without password)
const userUpdateSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  isActive: z.boolean().optional(),
  dateOfBirth: z.string().optional().or(z.literal("")),
  gender: z
    .enum(["MALE", "FEMALE", "NON-BINARY", "GENDERFLUID", "OTHER"])
    .optional(),
  role: z.enum(["ADMIN", "SPOTTER"]),
});

type UserUpdateFields = z.infer<typeof userUpdateSchema>;

const EditUserPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserReadOnlyDTO | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<UserUpdateFields>({
    resolver: zodResolver(userUpdateSchema),
  });

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await authFetch(`/api/users/${id}`);
        if (!response.ok) throw new Error("Failed to fetch user");

        const userData: UserReadOnlyDTO = await response.json();
        setUser(userData);

        setValue("username", userData.username);
        setValue("email", userData.email);
        setValue("firstname", userData.firstname);
        setValue("lastname", userData.lastname);
        setValue("role", userData.role);
        setValue("isActive", userData.isActive ?? true);
        setValue("dateOfBirth", userData.profileDetails?.dateOfBirth || "");
        setValue("gender", userData.profileDetails?.gender || "OTHER");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Operation failed");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data: UserUpdateFields) => {
    if (!id) return;

    const toastId = toast.loading("Updating user...");

    try {
      const updateData: UserUpdateDTO = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        dateOfBirth: data.dateOfBirth || undefined,
        gender: data.gender || undefined,
        isActive: data.isActive,
        // role: data.role,
      };

      const response = await authFetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update user");
      }

      toast.success("User updated successfully", { id: toastId });
      navigate("/users");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Operation failed", {
        id: toastId,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl text-purple font-logo">User not found</h2>
          <Button onClick={() => navigate("/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6 justify-center">
        <Button
          variant="ghost"
          onClick={() => navigate("/users")}
          className="mr-4 text-purple border border-purple/50 "
        >
          <ArrowLeft size={20} className="inline" /> Go Back
        </Button>
        <h2 className="text-3xl text-purple font-logo">Edit User</h2>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-offwhite/90 rounded-xl shadow-soft p-6 border-2 border-lilac/50 max-w-2xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="username" className="text-purple font-sans">
              Username
            </Label>
            <Input
              id="username"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("username")}
              disabled
            />
            {errors.username && (
              <p className="text-sm text-rose-800 font-sans">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-purple font-sans">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("email")}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-sm text-rose-800 font-sans">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="firstname" className="text-purple font-sans">
              First Name
            </Label>
            <Input
              id="firstname"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("firstname")}
              disabled={isSubmitting}
            />
            {errors.firstname && (
              <p className="text-sm text-rose-800 font-sans">
                {errors.firstname.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="lastname" className="text-purple font-sans">
              Last Name
            </Label>
            <Input
              id="lastname"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("lastname")}
              disabled={isSubmitting}
            />
            {errors.lastname && (
              <p className="text-sm text-rose-800 font-sans">
                {errors.lastname.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="dateOfBirth" className="text-purple font-sans">
              Date of Birth
            </Label>
            <Input
              type="date"
              id="dateOfBirth"
              className="border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple"
              {...register("dateOfBirth")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="gender" className="text-purple font-sans">
              Gender
            </Label>
            <select
              id="gender"
              {...register("gender")}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
              disabled={isSubmitting}
            >
              <option value="OTHER">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NON-BINARY">Non-binary</option>
              <option value="GENDERFLUID">Genderfluid</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="role" className="text-purple font-sans">
              Role
            </Label>
            <select
              id="role"
              {...register("role")}
              className="w-full px-3 py-2 text-sm rounded-lg border-2 border-lilac hover:border-sage/50 focus:ring-2 focus:ring-purple focus:outline-none text-purple bg-offwhite font-sans"
              disabled={isSubmitting}
            >
              <option value="SPOTTER">Spotter</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div>
            <Label htmlFor="isActive" className="text-purple font-sans">
              Account Status
            </Label>
            <div className="flex items-center gap-2">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register("isActive")}
                  defaultChecked={user?.isActive}
                />
                <span className="slider"></span>
              </label>
              <span>{user?.isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            className="border-lilac text-purple hover:bg-lilac/20"
            onClick={() => navigate("/users")}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-purple/80 hover:bg-purple text-offwhite shadow-soft flex items-center gap-2"
            disabled={isSubmitting}
          >
            <Save size={18} />
            {isSubmitting ? "Updating..." : "Update User"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditUserPage;
