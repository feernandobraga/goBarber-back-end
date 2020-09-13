import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

//importing the service so we can use it
import ResetPasswordService from "@modules/users/services/ResetPasswordService";

export default class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { password, token } = request.body;

    // using dependency injection to create a new service and pass the service to it
    const resetPassword = container.resolve(ResetPasswordService);

    await resetPassword.execute({
      token,
      password,
    });

    return response.status(204).json();
  }
}
