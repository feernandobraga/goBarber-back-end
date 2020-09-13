import { MongoRepository, getMongoRepository } from "typeorm";

// importing the interface with the methods from the repository-interface
import INotificationRepository from "@modules/notifications/repositories/INotificationRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";

// schema is used to strongly type the return type of methods in the class
import Notification from "../schemas/Notification";

class NotificationsRepository implements INotificationRepository {
  // instantiating the repository from ORM
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    // getMongoRepository requires 2 params, one is the schema and the other one is the connection name as per typeorm config file
    this.ormRepository = getMongoRepository(Notification, "mongo"); // instantiating the repository from ORM with the schema
  }

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
      recipient_id,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
