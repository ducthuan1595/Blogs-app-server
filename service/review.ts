import { UserType } from "../types"

export const createReviewService = async(message: string, user: UserType) => {
  try{

  }catch(err) {
    return {
      status: 500,
      message: 'Error from server'
    }
  }
}