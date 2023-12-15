import { IMovie } from "./IMovie";

export interface ITalent {
  _id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  biography: string;
  birthDate: string;
  movies: IMovie[];
  isDeleted: boolean;
}
