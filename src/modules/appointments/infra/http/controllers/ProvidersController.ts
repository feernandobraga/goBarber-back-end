import { Request, Response } from "express";

//import the container for dependency injection
import { container } from "tsyringe";

// importing the service used to create appointments
import ListProvidersService from "@modules/appointments/services/ListProvidersService";
import { classToClass } from "class-transformer";

export default class ProvidersController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id; // this gets the id from the logged user

    // instantiate a new Service -> CreateAppointmentService
    const listProviders = container.resolve(ListProvidersService);

    // since the execute() will save data to the database, this needs to be an asynchronous function and therefore, needs
    // the await keyword. Also, the method post needs to be an asynchronous function.
    const providers = await listProviders.execute({
      user_id,
    });

    // returns the newly created providers
    return response.json(classToClass(providers));
  }
}
