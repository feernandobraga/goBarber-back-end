import { Request, Response, NextFunction } from "express";

// method that verifies is our token hasn't been tampered
import { verify } from "jsonwebtoken";

// import the file that contains the JWT secret key
import authConfig from "@config/auth";

// import our custom error handling class
import AppError from "@shared/errors/AppError";

// interface with the content returned from the decoded token
interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("JWT token is missing", 401);
  }

  /**
   * The token will come in this format:
   * Bearer hashedToken
   * Therefore, we deconstruct the request and we split it based on the space character
   */
  const [type, token] = authHeader.split(" ");

  /**
   * The verify() method will decode the given token, and it takes two parameters:
   * 1. the token that was passed through the header
   * 2. the SAME key we use to encode the code before
   * We put it inside a try catch block just so we can give a better error message to the user
   */
  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // the as keyword forces the type TokenPayload to be applied to decoded
    const { sub } = decoded as TokenPayload;

    /**
     * Now, to pass the user information throughout my application routes/middleware, I can include the user information inside the requests
     * to be able to use .user inside request, I needed to create the express.d.ts file inside the folder src/@types
     * This will allow me to get the user id inside other routes by simply retrieving the value of request.user
     */
    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid JWT token", 401);
  }
}
