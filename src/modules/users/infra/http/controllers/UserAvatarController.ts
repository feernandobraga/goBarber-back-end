import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

// to apply the class-transformation
import { classToClass } from "class-transformer";

// import AvatarService
import UpdateUserAvatarService from "@modules/users/services/UpdateUserAvatarService";

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    /**
     * the method execute is passing the user_id for the logged user and the filename generated through the middleware upload.singe('avatar')
     * we can only retrieve the user_id from the request, because if you remember, we appended the type user inside the Request.
     * More on that you can find it in your notes about Route Guard - Advanced Routing
     */
    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;

    return response.json(classToClass(user));
  }
}
