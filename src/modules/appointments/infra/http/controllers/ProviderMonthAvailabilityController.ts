import { Request, Response } from "express";

//import the container for dependency injection
import { container } from "tsyringe";

// importing the service used to create appointments
import ListProviderMonthAvailabilityService from "@modules/appointments/services/ListProviderMonthAvailabilityService";

export default class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { provider_id } = request.params; // get the provider id from the URL
    const { month, year } = request.query; // gets the information from the API call

    // instantiate a new Service via dependency injection. It automatically passes the controller associated with it
    const listProviderMonthAvailabilityService = container.resolve(
      ListProviderMonthAvailabilityService
    );

    const availability = await listProviderMonthAvailabilityService.execute({
      provider_id,
      month: Number(month),
      year: Number(year),
    });

    // returns the newly created providers
    return response.json(availability);
  }
}
