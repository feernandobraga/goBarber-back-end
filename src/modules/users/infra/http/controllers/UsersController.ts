import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

// to apply the class-transformation
import { classToClass } from "class-transformer";

//importing the service so we can use it
import CreateUserService from "@modules/users/services/CreateUserService";

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    // we can delete the user password from the response, so it doesn't show back to the user/API request
    // delete user.password;

    return response.json(classToClass(user));
  }
}
