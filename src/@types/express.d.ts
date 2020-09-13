declare namespace Express {
  // here we are just adding the type user to a Request
  export interface Request {
    user: {
      id: string;
    };
  }
}
