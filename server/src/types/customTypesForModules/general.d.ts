import { IUser } from "../userTypes/UserType";

// declare module "express" {
//   export interface Request {
//     user: IUser;
//   }
//   export interface SuperStrangeAndWeirdExpressType {
//     space1: string;
//   }
// }

declare global {
  namespace Express {
    export interface Request {
      user: IUser;
    }
  }
}
