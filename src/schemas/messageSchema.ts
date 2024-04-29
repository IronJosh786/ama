import { z } from "zod";

export const messageSchema = z
  .string()
  .trim()
  .min(10, { message: "Message must be atleast 10 characters" })
  .max(250, { message: "Message can be atmost 250 characters long" });
