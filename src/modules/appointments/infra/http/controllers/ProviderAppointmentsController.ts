import { Request, Response } from "express";

import { parseISO } from "date-fns";

//import the container for dependency injection
import { container } from "tsyringe";

// importing the service used to create appointments
import ListProviderAppointmentsService from "@modules/appointments/services/ListProviderAppointmentsService";

export default class ProviderAppointmentsController {
  public async index(request: Request, response: Response): Promise<Response> {
    // gets the barber and the date to create an appointment
    const { day, month, year } = request.query;

    // retrieving the user that is logged in
    const provider_id = request.user.id;

    // instantiate a new Service -> CreateAppointmentService
    const listProviderAppointments = container.resolve(ListProviderAppointmentsService);

    // since the execute() will save data to the database, this needs to be an asynchronous function and therefore, needs
    // the await keyword. Also, the method post needs to be an asynchronous function.
    const appointments = await listProviderAppointments.execute({
      provider_id,
      day: Number(day),
      month: Number(month),
      year: Number(year),
    });

    // returns the newly created appointment
    return response.json(appointments);
  }
}
