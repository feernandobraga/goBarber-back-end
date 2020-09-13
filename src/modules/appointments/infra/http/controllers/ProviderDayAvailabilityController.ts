import { Request, Response } from "express";

//import the container for dependency injection
import { container } from "tsyringe";

// importing the service used to create appointments
import ListProviderDayAvailabilityService from "@modules/appointments/services/ListProviderDayAvailabilityService";

export default class ProviderDayAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params; // get the provider id from the URL
    const { month, day, year } = request.query; // gets the information from the URL

    // instantiate a new Service via dependency injection. It automatically passes the repository associated with it
    const listProviderDayAvailabilityService = container.resolve(
      ListProviderDayAvailabilityService
    );

    const availability = await listProviderDayAvailabilityService.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    // returns the newly created providers
    return response.json(availability);
  }
}
