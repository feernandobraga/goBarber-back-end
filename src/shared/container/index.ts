/**
 * This files is responsible for the dependency injection
 * it links an interface with a repository
 */
import { container } from "tsyringe";

// importing the dependency injection for the hashing provider
import "@modules/users/providers";

// importing the dependency injection for the disk storage provider
import "./providers";

//importing the repository and interface for appointments
import IAppointmentsRepository from "@modules/appointments/repositories/IAppointmentsRepository";
import AppointmentsRepository from "@modules/appointments/infra/typeorm/repositories/AppointmentsRepository";

//importing the repository and interface for users
import IUsersRepository from "@modules/users/repositories/IUsersRepository";
import UsersRepository from "@modules/users/infra/typeorm/repositories/UsersRepository";

//importing the repository and interface for user tokens
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";
import UserTokensRepository from "@modules/users/infra/typeorm/repositories/UserTokensRepository";

// repository-interface and repository-infra for notifications dependency injection
import INotificationRepository from "@modules/notifications/repositories/INotificationRepository";
import NotificationsRepository from "@modules/notifications/infra/typeorm/repositories/NotificationsRepository";

/**
 * the register.Singleton gets 2 parameters
 * an ID -> AppointmentsRepository
 * the repository that will be injected when the ID is called
 */
container.registerSingleton<IAppointmentsRepository>(
  "AppointmentsRepository",
  AppointmentsRepository
);

container.registerSingleton<IUsersRepository>("UsersRepository", UsersRepository);

container.registerSingleton<IUserTokensRepository>(
  "UserTokensRepository",
  UserTokensRepository
);

container.registerSingleton<INotificationRepository>(
  "NotificationsRepository",
  NotificationsRepository
);
