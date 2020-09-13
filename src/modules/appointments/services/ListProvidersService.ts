// import our custom error handling class
import AppError from "@shared/errors/AppError";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

import User from "@modules/users/infra/typeorm/entities/User";
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";
import { classToClass } from "class-transformer";

// the method execute will receive the user_id.
interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    // try to fetch information from the cache database
    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    // users = null;
    if (!users) {
      // if information doesn't exists in the cached database, fetch it from the relational database and save it into redis
      users = await this.usersRepository.findAllProviders({
        except_user_id: user_id,
      });

      await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users)); // semi-column is used to separate categories in redis
    }

    return users;
  }
}

export default ListProvidersService;
