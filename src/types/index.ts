import { ObjectId } from "mongoose";

export type PostType = {
  _id: ObjectId;
  title: string;
  userId: UserType;
  categoryId: CategoryType | string;
  desc: string;
  image: ImageType[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
  totalLiked?: number;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  password: string;
  roleId: {
      user: Boolean,
      moderator: Boolean,
      admin: Boolean,
      guest: Boolean,
  };
  avatar: Buffer;
  createdAt?: NativeDate;
  updatedAt?: NativeDate;
};

export type CategoryType = {
  _id: string;
  name: string;
  slogan: string;
  image: ImageType;
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

export type ImageType = {
  url: string;
  public_id: string;
};

export interface RequestPostType {
  title: string;
  desc: string;
  postId?: string;
  image: ImageType[];
  categoryId: string;
}