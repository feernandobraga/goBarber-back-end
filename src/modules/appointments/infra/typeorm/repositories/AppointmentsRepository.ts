import { getRepository, Repository, Raw } from "typeorm";

import Appointment from "../entities/Appointment";

// importing the interface with the methods from the repository
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";

// importing the type required to create an appointment
import ICreateAppointmentDTO from "@modules/appointments/dtos/ICreateAppointmentDTO";

// importing the type required for finding all appointments for the month from a given provider
import IFindAllInMonthFromProviderDTO from "@modules/appointments/dtos/IFindAllInMonthFromProviderDTO";
import IFindAllInDayFromProviderDTO from "@modules/appointments/dtos/IFindAllInDayFromProviderDTO";

class AppointmentsRepository implements IAppointmentsRepository {
  //injecting/instantiating the repository from ORM
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(
    date: Date,
    provider_id: string
  ): Promise<Appointment | undefined> {
    // .findOne() is one of the many methods available to the Repository Interface that we inherited in this class
    const findAppointment = await this.ormRepository.findOne({
      where: { date, provider_id },
    });

    // returns the appointment if it finds it, otherwise, returns undefined
    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    /**
     * retrieve the availability for the month from a given provider
     */

    // reading padStart() -> if the variable doesn't have two digits, add 0 as the first digit
    const parsedMonth = String(month).padStart(2, "0"); //this will convert the month to two digits, ie 1 becomes 01, 3 becomes 03, 10 remains 10

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (
            dateFieldName // Raw() is used to deal with SQL query directly
          ) => `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`
        ),
      },
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    /**
     * retrieve the availability for the day from a given provider
     */

    // reading padStart() -> if the variable doesn't have two digits, add 0 as the first digit
    const parsedMonth = String(month).padStart(2, "0"); //this will convert the month to two digits, ie 1 becomes 01, 3 becomes 03, 10 remains 10

    const parsedDay = String(day).padStart(2, "0");

    const appointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          (
            dateFieldName // Raw() is used to deal with SQL query directly
          ) =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`
        ),
      },
      relations: ["user"], // this will bring the user associated to that appointment
    });

    return appointments;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentDTO): Promise<Appointment> {
    const appointment = this.ormRepository.create({ provider_id, user_id, date });

    await this.ormRepository.save(appointment);

    return appointment;
  }
}

export default AppointmentsRepository;
