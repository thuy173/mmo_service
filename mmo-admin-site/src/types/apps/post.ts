import { PostCategoryDto } from "./postCategory";

export interface PostDto {
  id: number;
  title: string;
  postCategory: PostCategoryDto;
  thumbnail: string;
  shortContent: string;
  content: string;
  author: Author;
  active: boolean;
}

export interface Author {
  id: number;
  fullName: string;
  avatar: string;
}
