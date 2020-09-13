// method to sign/create the JWT token
import { sign } from "jsonwebtoken";

// import the file that contains the JWT secret key
import authConfig from "@config/auth";

import User from "../infra/typeorm/entities/User";

// import our custom error handling class
import AppError from "@shared/errors/AppError";

import IUsersRepository from "../repositories/IUsersRepository";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

// import the interface for the provider responsible for hashing the passwords
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

// interface to handle the request from the routes
interface IRequest {
  email: string;
  password: string;
}

// interface to handle the response type from the method execute
interface IResponse {
  user: User;
  token: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    // select * from users where email is equals to the email passed to the method execute
    const user = await this.usersRepository.findByEmail(email);

    console.log(user);

    if (!user) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    // the method compare() returns true or false if the password give is equal to the password hashed in the database
    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Incorrect email/password combination", 401);
    }

    /**
     * the method sign takes three arguments:
     * 1. the payload that we want to embed inside the token
     * 2. a key that encrypts the token against tampering
     * 3. an object{} with some configuration
     *  - subject → user id that generated the token - this is used so we can link the token to the user
     *  - expiresIn → how long this token will be valid
     */
    const { secret, expiresIn } = authConfig.jwt;
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn,
    });

    return {
      user,
      token,
    };
  }
}

export default AuthenticateUserService;
