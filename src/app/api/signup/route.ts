import bcrypt from "bcryptjs";
import UserModel from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, email, password } = await request.json();

    const isVerifiedUserPresent = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (isVerifiedUserPresent) {
      return Response.json(
        { success: false, message: "Username already taken" },
        { status: 400 }
      );
    }

    const isPresent = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresIn = new Date();
    expiresIn.setHours(expiresIn.getHours() + 1);
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isPresent) {
      if (isPresent.isVerified) {
        return Response.json(
          { success: false, message: "Email already taken" },
          { status: 400 }
        );
      } else {
        isPresent.password = hashedPassword;
        isPresent.verifyCode = verifyCode;
        isPresent.verifyCodeExpiry = expiresIn;
        const sentEmail = await sendVerificationEmail({
          email,
          username,
          verifyCode,
        });
        if (!sentEmail.success) {
          return Response.json(
            {
              success: false,
              message: sentEmail.message,
            },
            { status: 500 }
          );
        }
        await isPresent.save({ validateBeforeSave: true });
      }
    } else {
      const newUser = {
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiresIn,
      };
      const sentEmail = await sendVerificationEmail({
        email,
        username,
        verifyCode,
      });
      if (!sentEmail.success) {
        return Response.json(
          {
            success: false,
            message: sentEmail.message,
          },
          { status: 500 }
        );
      }
      await UserModel.create(newUser);
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error while registering the user: ", error);
    return Response.json(
      { success: false, message: "Could not register the user" },
      { status: 500 }
    );
  }
}
