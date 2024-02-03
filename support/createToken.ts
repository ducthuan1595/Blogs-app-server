import jwt from "jsonwebtoken";

export default function generateToken(id: string) {
  if (process.env.JWT_SECRET) {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: "60d",
    });
  }
}
