import { Response } from "express";
import { RequestCustom } from "../middleware/authentication";
import { createReviewService } from '../service/service.review';

export const createReview = async (req: RequestCustom, res: Response) => {
  const { message } = req.body;
  if (!message || !req.user) {
    return res.status(404).json({ message: "Not found" });
  }
  const data = await createReviewService(message, req.user);
  if (data) {
    return res
      .status(data.status)
      .json({ message: data.message, data: data?.data });
  }
}; 