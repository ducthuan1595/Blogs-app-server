import jwt from "jsonwebtoken";

function createToken(id: string) {
  if (process.env.JWT_SECRET_TOKEN) {
    return jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "30s",
    });
  }
}

function createRefreshToken (id: string) {
  if (process.env.JWT_SECRET_REFRESH_TOKEN) {
    return jwt.sign({ id }, process.env.JWT_SECRET_REFRESH_TOKEN, {
      expiresIn: "1h",
    });
  }
}

export {
  createToken,
  createRefreshToken,
}
