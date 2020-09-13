import User from "../infra/typeorm/entities/User";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

// import our custom error handling class
import AppError from "@shared/errors/AppError";
import IUsersRepository from "../repositories/IUsersRepository";

// import the interface for the provider responsible for hashing the passwords
import IHashProvider from "../providers/HashProvider/models/IHashProvider";

// for handling the cached database
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

// interface that tells how the API will send data to the method execute, which is of type Request.
interface IRequest {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("HashProvider")
    private hashProvider: IHashProvider,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  // this is an asynchronous method that returns a promise of a type User, because we want to return a user
  public async execute({ name, email, password }: IRequest): Promise<User> {
    // this will allow for calling all generic Repository methods. i.e. userRepository.save(newUser)

    // select * from Users where email = given email passed through to execute()
    const checkUserExists = await this.usersRepository.findByEmail(email);

    if (checkUserExists) {
      throw new AppError("Email address already used");
    }

    // calls the hashProvider that is responsible for hashing passwords using bcrypt
    const hashedPassword = await this.hashProvider.generateHash(password);

    // instantiates a new user but doesn't yet saves it to the database
    const user = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    await this.cacheProvider.invalidatePrefix("providers-list");

    return user;
  }
}

export default CreateUserService;
