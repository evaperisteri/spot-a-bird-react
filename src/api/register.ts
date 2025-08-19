import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(5),
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "SPOTTER"]),
  isActive: z.boolean(),
  dateOfBirth: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE", "NON-BINARY", "GENDERFLUID", "OTHER"]),
});

export type RegisterFields = z.infer<typeof registerSchema> & {
  isActive: boolean;
};
