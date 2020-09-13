import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

// to apply the class-transformation
import { classToClass } from "class-transformer";

//importing the service so we can use it
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import ShowProfileService from "@modules/users/services/ShowProfileService";

export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; //capture the user id from the authenticated user

    const showProfile = container.resolve(ShowProfileService); // instantiate the service using dependency injection

    const user = await showProfile.execute({ user_id }); // run the execute() method from the service

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // this is got from the authenticated user. We can do this because of the middleware ensureAuthenticated

    const { name, email, old_password, password } = request.body;

    const updateProfile = container.resolve(UpdateProfileService);

    const user = await updateProfile.execute({
      name,
      email,
      password,
      old_password,
      user_id,
    });

    // we can delete the user password from the response, so it doesn't show back to the user/API request
    delete user.password;

    return response.json(classToClass(user));
  }
}
