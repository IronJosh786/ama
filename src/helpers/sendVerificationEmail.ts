import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/apiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

interface EmailData {
  email: string;
  username: string;
  verifyCode: string;
}

export async function sendVerificationEmail({
  email,
  username,
  verifyCode,
}: EmailData): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Email verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (!response.data) {
      return {
        success: false,
        message: response.error?.message || "Could not send email",
      };
    }
    return {
      success: true,
      message: "Sent the verification email successfully",
    };
  } catch (error) {
    console.log("Error while sending verification email: ", error);
    return { success: false, message: "Could not send verification email" };
  }
}
