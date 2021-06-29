import User from "../db/models/user";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}
