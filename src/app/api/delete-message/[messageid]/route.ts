import UserModel from "@/models/user.model";
import { getServerSession } from "next-auth/next";
import dbConnection from "@/lib/dbConnection";
import { User } from "next-auth";
import { Message } from "@/models/user.model";
import { authOptions } from "../../auth/[...nextauth]/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnection();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    const deletedMessage = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: {
          messages: { _id: messageId },
        },
      }
    );

    if (deletedMessage.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Could not find the message" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Deleted the message" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Could not delete the message", error);
    return Response.json(
      { success: false, message: "Could not delete the message" },
      { status: 500 }
    );
  }
}
