import Appointment from "../infra/typeorm/entities/Appointment";

import { startOfHour, isBefore, getHours, format } from "date-fns";

// import our custom error handling class
import AppError from "@shared/errors/AppError";

// import the dependency injection lib
import { injectable, inject } from "tsyringe";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";
import INotificationsRepository from "@modules/notifications/repositories/INotificationRepository";
import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider";

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("NotificationsRepository")
    private notificationsRepository: INotificationsRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  // date and provider are parameters coming from the routes, and strongly type it through the interface IRequest just above this line.
  public async execute({ date, provider_id, user_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (isBefore(appointmentDate, Date.now())) {
      // user should not be able to book an appointment in the past
      throw new AppError("You cannot create an appointment in a past date");
    }

    if (user_id === provider_id) {
      // user should not be able to schedule an appointment with himself
      throw new AppError("You cannot create an appointment with yourself");
    }

    // runs the method findByDate() from the AppointmentsRepository and if it finds one appointment, returns it,
    // otherwise, it returns null. Since it is querying the database, it needs to be an asynchronous function
    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      provider_id
    );

    if (findAppointmentInSameDate) {
      // condition for two appointments in the same hour
      throw new AppError("This time slot is not available anymore");
    }

    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      // user can only make bookings within the business hours
      throw new AppError(
        "You cannot create appointments out of the business hours - 8AM - 5PM"
      );
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    const dateFormatted = format(appointmentDate, "dd/MM/yyyy 'at' HH:mm'h'"); // formatting the date to pass it on as notification

    // once the appointment is create, it stores a notification on MongoDB
    await this.notificationsRepository.create({
      recipient_id: provider_id,
      content: `You have a new booking on the ${dateFormatted}`,
    });

    await this.cacheProvider.invalidatePrefix(
      // when a new appointment is create, we need to invalidate the cache
      `provider-appointments:${provider_id}:${format(appointmentDate, "yyyy-M-d")}`
    );
    console.log(
      `cache invalidated: provider-appointments:${provider_id}:${format(
        appointmentDate,
        "yyyy-M-d"
      )}`
    );

    return appointment;
  }
}

export default CreateAppointmentService;
