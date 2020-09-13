import { ObjectID, Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn } from "typeorm";

@Entity("notifications") // this is the name of the collection, which is the equivalent to a table in relation databases
class Notification {
  @ObjectIdColumn() // indicates an unique identifier
  id: ObjectID; //objectID is the equivalent to uuid from postgres to mongo

  @Column()
  content: string; // the content from the notification

  @Column('uuid') // indicates the column will store an uuid
  recipient_id: string; // the user_id that is receiving the message

  @Column({ default: false }) // the column has the value false as default
  read: boolean; // if the message was read or not

  @CreateDateColumn() // timestamp when the record is created
  created_at: Date;

  @UpdateDateColumn() // timestamp when the record is updated
  update_at: Date;
}

export default Notification;
