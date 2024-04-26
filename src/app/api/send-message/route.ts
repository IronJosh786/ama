import { z } from "zod";
import UserModel from "@/models/user.model";
import { Message } from "@/models/user.model";
import dbConnection from "@/lib/dbConnection";
import { messageSchema } from "@/schemas/messageSchema";

const MessageSchema = z.object({
  message: messageSchema,
});

export async function POST(request: Request) {
  await dbConnection();
  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }

    const messageCheck = {
      message: content,
    };
    const messageResult = MessageSchema.safeParse(messageCheck);
    if (!messageResult.success) {
      return Response.json(
        {
          success: false,
          message: messageResult.error.errors[0].message,
        },
        { status: 400 }
      );
    }
    const { message } = messageResult.data;
    const newMessage = {
      content: message,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    user.messages?.push(newMessage as Message);
    const sentMessage = await user.save({ validateBeforeSave: false });
    if (!sentMessage) {
      return Response.json(
        {
          success: false,
          message: "Could not send the message",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Sent the message",
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Could not send the message",
      },
      { status: 500 }
    );
  }
}
