export type PostType = {
  _id: string;
  title: string;
  userId: UserType;
  categoryId: CategoryType;
  description: string;
  images: ImageType[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  // password: string;
  role: string;
  photo: ImageType;
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