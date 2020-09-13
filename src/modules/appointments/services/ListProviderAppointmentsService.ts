// import our custom error handling class
import AppError from "@shared/errors/AppError";

// importing dependency injection decorators
import { injectable, inject } from "tsyringe";

// to find out how many days in a month
import { getDaysInMonth, getDate } from "date-fns";

import Appointment from "../infra/typeorm/entities/Appointment";

import IAppointmentsRepository from "../repositories/IAppointmentsRepository";

import ICacheProvider from "@shared/container/providers/CacheProvider/models/ICacheProvider"; // so we can use the cache provider
import { classToClass } from "class-transformer"; // for serialization (to change how we return the API call)

// interface used by the execute
interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject("AppointmentsRepository")
    private appointmentsRepository: IAppointmentsRepository,

    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  public async execute({
    provider_id,
    year,
    month,
    day,
  }: IRequest): Promise<Appointment[]> {
    const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

    let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey); // retrieve all appointments in redis for that given key

    console.log(`cache created ${cacheKey}`);
    console.log(`content from cache ${appointments?.length}`);

    // appointments = null;
    if (!appointments) {
      // if result not found in cached database, retrieve from postgres and save in redis
      appointments = await this.appointmentsRepository.findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
      });

      await this.cacheProvider.save(cacheKey, classToClass(appointments));
    }

    return appointments;
  }
}

export default ListProviderAppointmentsService;
