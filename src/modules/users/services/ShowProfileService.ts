// import our custom error handling class
import AppError from "@shared/errors/AppError";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";

// the method execute will receive the user_id.
interface IRequest {
  user_id: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("@ShowProfileServiceService - User was not found");
    }

    return user;
  }
}

export default ShowProfileService;
