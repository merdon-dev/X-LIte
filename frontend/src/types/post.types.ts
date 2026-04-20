import type { UserType } from "./user.types";

export interface PostType {
  comments: CommentType[];
  createdAt: string;
  image: string;
  likes: LikeType[];
  text: string;
  updatedAt: string;
  userId: UserType;
  __v: number;
  _id: string;
}

export interface LikeType {
  userId: string;
  _id: string;
}
export interface CommentType {
  userId: UserType;
  comment: string;
  _id: string;
  createdAt: string;
}
