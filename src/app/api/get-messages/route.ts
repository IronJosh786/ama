import { User } from "next-auth";
import UserModel from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import mongoose from "mongoose";

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
    const userId = new mongoose.Types.ObjectId(user._id);
    const currentUser = await UserModel.findById(userId);
    if (!currentUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const messages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]).exec();

    if (!messages || !messages.length) {
      return Response.json(
        {
          success: true,
          message: "No messages found",
        },
        { status: 200 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Fetched messages",
        messages: messages[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Could not fetch the messages",
      },
      { status: 500 }
    );
  }
}
