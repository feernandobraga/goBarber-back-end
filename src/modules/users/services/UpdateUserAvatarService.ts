import path from "path";

// we import the upload config file so we can get what is the directory where the images are being saved
import uploadConfig from "@config/upload";

// library to handle file system
import fs from "fs";

// import our custom error handling class
import AppError from "@shared/errors/AppError";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

import User from "../infra/typeorm/entities/User";
import IUsersRepository from "../repositories/IUsersRepository";

//importing the storage provider
import IStorageProvider from "@shared/container/providers/StorageProvider/models/IStorageProvider";

// the method execute will receive the user_id and the filename.
// the filename comes from the multer middleware that we used in the routes
interface IRequest {
  user_id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository,

    @inject("StorageProvider")
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ user_id, avatarFilename }: IRequest): Promise<User> {
    // check if the given user id is really a valid user_id
    // select user from users where the user.id = user_id passed to execute
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Only Authenticated users can change avatar.", 401);
    }

    console.log("inside avatar");

    // if the avatar already exists, delete previous avatar from the storage
    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const filename = await this.storageProvider.saveFile(avatarFilename);

    console.log("filesaved");

    // since we already loaded the user at the beginning of this file, we can just update the avatar and save it to the DB
    user.avatar = filename;
    await this.usersRepository.save(user);

    console.log("just before returning user");

    return user;
  }
}

export default UpdateUserAvatarService;
