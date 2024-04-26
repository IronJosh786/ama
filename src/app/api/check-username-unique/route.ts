import { z } from "zod";
import UserModel from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameSchema = z.object({
  username: usernameValidation,
});

export async function GET(request: Request) {
  await dbConnection();
  try {
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };
    const result = UsernameSchema.safeParse(queryParam);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          message:
            usernameError.length > 0
              ? usernameError
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }
    const { username } = result.data;
    const existingUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUser) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "Unique username" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error while checking unique username: ", error);
    return Response.json(
      { success: false, message: "Could not check username" },
      { status: 500 }
    );
  }
}
