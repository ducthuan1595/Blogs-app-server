export type PostType = {
  _id: string;
  title: string;
  userId: UserType;
  categoryId: CategoryType | string;
  description: string;
  image: ImageType[];
  createdAt: NativeDate;
  updatedAt: NativeDate;
};

export type UserType = {
  _id: string;
  username: string;
  email: string;
  // password: string;
  roleId: {
      user: Boolean,
      moderator: Boolean,
      admin: Boolean,
      guest: Boolean,
  };
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