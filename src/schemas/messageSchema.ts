import { z } from "zod";

export const messageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be atleast 2 characters" })
    .max(250, { message: "Message can be atmost 250 characters long" }),
});
