import { Request, Response } from "express";

// import container for dependency injection
import { container } from "tsyringe";

//importing the service so we can use it
import SendForgotPasswordEmailService from "@modules/users/services/SendForgotPasswordEmailService";

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    // using dependency injection to create a new service and pass the service to it
    const sendForgotPasswordEmail = container.resolve(SendForgotPasswordEmailService);

    await sendForgotPasswordEmail.execute({
      email,
    });

    return response.status(204).json();
  }
}
