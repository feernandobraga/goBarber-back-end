// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

import IUsersRepository from "../repositories/IUsersRepository";

// import interface for using a token repository
import IUserTokensRepository from "../repositories/IUserTokensRepository";

import IMailProvider from "@shared/container/providers/MailProvider/models/IMailProvider";
import AppError from "@shared/errors/AppError";

// importing the hashing provider interface to inject in the constructor
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

// import to handle time
import { isAfter, addHours } from "date-fns";

// interface that tells how the API will send data to the method execute, which is of type Request.
interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPasswordService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("UserTokensRepository")
    private userTokensRepository: IUserTokensRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider
  ) {}

  /**
   * The method receives a token and a password
   * it then checks if the given token exists in the userToken table/repository
   * If it find the token then it looks for the user associated with it and then attributes the new password to the user
   */
  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError("User token does not exist");
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError("User does not exist");
    }

    const tokenCreateAt = userToken.created_at;
    const compareDate = addHours(tokenCreateAt, 2);

    // console.log(`token created at ${tokenCreateAt}`);
    // console.log("now", new Date(Date.now()));
    // console.log(`compare Date ${new Date(compareDate)}`);

    const newCompareDate = new Date(compareDate);
    // console.log("is after: ", result);
    // console.log(userToken.created_at);
    // const now = new Date();

    if (isAfter(Date.now(), compareDate)) {
      throw new AppError("Expired Token :(");
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.usersRepository.save(user);
  }
}

export default ResetPasswordService;
