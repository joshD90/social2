import { IUser } from "../userTypes/UserType";

// declare module "express" {
//   export interface Request {
//     user: IUser;
//   }
// }

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}
