import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isAcceptingMessage?: boolean;
  messages?: Message[];
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<User> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAcceptingMessage: {
      type: Boolean,
      required: true,
      default: true,
    },
    messages: [messageSchema],
    verifyCode: {
      type: String,
      required: true,
    },
    verifyCodeExpiry: {
      type: Date,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
