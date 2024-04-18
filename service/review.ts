import { UserType } from "../types"

export const createReviewService = async(message: string, user: UserType) => {
  try{
    return {
      status: 301,
      message: 'Developing',
      data: []
    }
  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}