import { z } from "zod";

export const usernameValidation = z
  .string()
  .trim()
  .min(2, { message: "Username must be atleast 2 characters" })
  .max(10, { message: "Username can be atmost 10 characters long" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Only alphabets, digits and underscore are allowed",
  });

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "Password must be atleast 8 characters" }),
});
