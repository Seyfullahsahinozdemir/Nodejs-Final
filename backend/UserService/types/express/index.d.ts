import { Request } from "express";

declare global {
  declare namespace Express {
    interface Request {
      user: {
        id: string;
        username: string;
        isAdmin: boolean;
        email: string;
      };
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
    }
  }
}
