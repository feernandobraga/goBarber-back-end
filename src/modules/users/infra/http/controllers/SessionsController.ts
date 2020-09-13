import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

// to apply the class-transformation
import { classToClass } from "class-transformer";

//importing the service so we can use it
import AuthenticateUserService from "@modules/users/services/AuthenticateUserService";

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    // using dependency injection to create a new service and pass the service to it
    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token });
  }
}
