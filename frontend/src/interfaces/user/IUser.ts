import { IMovie } from "../IMovie";
import { IPreferences } from "./IPreferences";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  createdAt: string;
  email: string;
  favorites: IMovie[];
  isAdmin: boolean;
  isDeleted: boolean;
  preferences: IPreferences;
}
