import { Request, Response } from "express";

import { parseISO } from "date-fns";

//import the container for dependency injection
import { container } from "tsyringe";

// importing the service used to create appointments
import CreateAppointmentService from "@modules/appointments/services/CreateAppointmentService";

export default class AppointmentsController {
  public async create(request: Request, response: Response): Promise<Response> {
    // gets the barber and the date to create an appointment
    const { provider_id, date } = request.body;

    // retrieving the user that is logged in
    const user_id = request.user.id;

    // gets the date that is coming from the api, converts is to a JS object
    // const parsedDate = parseISO(date);

    // instantiate a new Service -> CreateAppointmentService
    const createAppointment = container.resolve(CreateAppointmentService);

    // since the execute() will save data to the database, this needs to be an asynchronous function and therefore, needs
    // the await keyword. Also, the method post needs to be an asynchronous function.
    const appointment = await createAppointment.execute({
      date,
      provider_id,
      user_id,
    });

    // returns the newly created appointment
    return response.json(appointment);
  }
}
