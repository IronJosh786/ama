import { z } from "zod";
import UserModel from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { usernameValidation } from "@/schemas/signUpSchema";
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";

export const VerifySchema = z.object({
  code: verifyCodeSchema,
});

const UsernameSchema = z.object({
  username: usernameValidation,
});

export async function POST(request: Request) {
  await dbConnection();
  try {
    let { username, code } = await request.json();
    const usernameCheck = {
      username: decodeURIComponent(username),
    };
    const codeCheck = {
      code: decodeURIComponent(code),
    };
    const usernameResult = UsernameSchema.safeParse(usernameCheck);
    const codeResult = VerifySchema.safeParse(codeCheck);
    if (!usernameResult.success) {
      return Response.json(
        {
          success: false,
          message: "username " + usernameResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }
    if (!codeResult.success) {
      return Response.json(
        {
          success: false,
          message: "code " + codeResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({
      username: usernameResult.data.username,
    });
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
    const isCodeIncorrect = codeResult.data.code !== user.verifyCode;

    if (isCodeExpired || isCodeIncorrect) {
      return Response.json(
        { status: false, message: "Code expired/incorrect" },
        { status: 400 }
      );
    }

    user.isVerified = true;
    await user.save({ validateBeforeSave: false });
    return Response.json(
      { success: true, message: "Verification successful" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Could not verify code", error);
    return Response.json(
      { success: false, message: "Could not verify code" },
      { status: 500 }
    );
  }
}
