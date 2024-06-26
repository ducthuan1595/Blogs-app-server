import { PostType } from "../types"

export const pageSection = (page: number, limit:number, data: PostType[]) => {
  const totalPage = Math.ceil(data.length / limit);
  const start = (page - 1) * limit;
  const end = page * limit;
  const result = data.slice(start, end);

  return {
    result,
    totalPage
  }
}