import { z } from "zod";

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, { message: "Verification code must be of 6 characters" }),
});
