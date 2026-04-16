import { IUser } from "../src/models/user.model.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
