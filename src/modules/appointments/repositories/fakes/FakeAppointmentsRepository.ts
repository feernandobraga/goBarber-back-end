import { uuid } from "uuidv4";

// import isEqual to compare two dates
import { isEqual, getMonth, getYear, getDate } from "date-fns";

import Appointment from "../../infra/typeorm/entities/Appointment";

// importing the interface with the methods from the repository
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

// importing the type required to create an appointment
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

// importing the type required for finding all appointments for the month from a given provider
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements IAppointmentsRepository {
  // creating an array of appointments
  private appointments: Appointment[] = [];

  /**
   * find an appointment by date
   */
  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    const findAppointment = this.appointments.find(
      (appointment) =>
        isEqual(appointment.date, date) && appointment.provider_id === provider_id
    );

    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    /**
     * retrieve the availability for the month from a given provider
     */
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getDate(appointment.date) === day &&
        getMonth(appointment.date) + 1 === month && // it needs the +1 because month starts from 0 in JavaScript forfucksake
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    /**
     * retrieve the availability for the month from a given provider
     */
    const appointments = this.appointments.filter((appointment) => {
      return (
        appointment.provider_id === provider_id &&
        getMonth(appointment.date) + 1 === month && // it needs the +1 because month starts from 0 in JavaScript forfucksake
        getYear(appointment.date) === year
      );
    });

    return appointments;
  }

  /**
   * function to create an appointment
   */
  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = new Appointment();

    Object.assign(appointment, { id: uuid(), date, provider_id, user_id }); // is the same of writing it as per the comments below
    // appointment.id = uuid();
    // appointment.date = date;
    // appointment.provider_id = provider_id;

    this.appointments.push(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
