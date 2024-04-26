import { User } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";

export async function POST(request: Request) {
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Login required" },
      { status: 400 }
    );
  }
  const { acceptMessage } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $set: {
          isAcceptingMessage: acceptMessage,
        },
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        { success: false, message: "Could not update the user" },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: acceptMessage
          ? "Messages will be accepted"
          : "Messages will not be accepted",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Could not update the accepting status", error);
    return Response.json(
      {
        success: false,
        message: "Could not update the accepting status",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  await dbConnection();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Login required" },
      { status: 400 }
    );
  }

  try {
    const currentUser = await UserModel.findById(user._id);
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Fetched the message acceptance status",
        acceptMessage: currentUser?.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Could not fetch the message acceptance status",
      },
      { status: 500 }
    );
  }
}
