// used to create a fake objectID
import { ObjectID } from "mongodb";

// importing the interface with the methods from the repository-interface
import INotificationRepository from "@modules/notifications/repositories/INotificationRepository";
import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";

// schema is used to strongly type the return type of methods in the class
import Notification from "../../infra/typeorm/schemas/Notification";

class NotificationsRepository implements INotificationRepository {
  private notifications: Notification[] = [];

  public async create({
    content,
    recipient_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, recipient_id }); // new ObjectID creates a new id as mongo does

    this.notifications.push(notification);

    return notification;
  }
}

export default NotificationsRepository;
