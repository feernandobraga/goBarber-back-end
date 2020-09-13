// import our custom error handling class
import AppError from "@shared/errors/AppError";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

// to find out how many days in a month
import { getDaysInMonth, getDate, isAfter } from "date-fns";

import User from "@modules/users/infra/typeorm/entities/User";
import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

// interface used by the execute
interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

// converts the interface to an interface that returns an array
type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository
  ) {}

  public async execute({ provider_id, year, month }: IRequest): Promise<IResponse> {
    // retrieves all appointments for the month for a particular provider
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
      provider_id,
      year,
      month,
    });

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // this creates an array based on the number of days in a month
    const eachDayArray = Array.from(
      {
        length: numberOfDaysInMonth,
      },
      (value, index) => index + 1
    );

    // this will go through each day of the month
    const availability = eachDayArray.map((day) => {
      // and then will return all appointments where day is equals to the day from the map() function
      // appointmentsInDay is an array that stores appointments, so by checking its length, we now how many appointments we have on that day
      const compareDate = new Date(year, month - 1, day, 23, 59, 59); // this will create a date in the last second of the day and we use this to compare with the current hour.
      // (continuing from line above) only disables the day if NOW() is greater than > compareDate
      const appointmentsInDay = appointments.filter((appointment) => {
        return getDate(appointment.date) === day;
      });

      return {
        day,
        // se o final do dia(compareDate) eh maior que agora, significa que o dia ainda nao acabou e portanto pode ter horarios disponiveis
        available: isAfter(compareDate, new Date()) && appointmentsInDay.length < 10, // a day can only have 10 appointments, so if >= 10, no slots are available
        // change to < 1, to pass the test
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;
