export interface IMovie {
  _id: string;
  name: string;
  categories: any;
  createdAt: string;
  publishedAt: string;
  description: string;
  comments: any;
  newComments: any;
  actors: any;
  directors: any;
  isDeleted: boolean;
  averageTotal: number;
}
