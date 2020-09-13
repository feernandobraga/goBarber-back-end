import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import uploadConfig from "@config/upload";

// to change the API response
import { Expose, Exclude } from "class-transformer";

/**
 * by adding @Entity we are linking new objects from this class with the database, so when you save an object of
 * User type, it also will save it to the database.
 * We also need to link each property from the class to a column in the database by using more decorators
 */

/**
 * Because we removed the constructor, TypeScript will complaint that the variables were not initialized.
 * However, the TypeORM does it in the background.
 * To get rid of the error, we uncomment the configuration "strictPropertyInitialization:" and we set it to false in the tsconfig.json
 */
@Entity("users") // users is the name of the table in the database
class User {
  @PrimaryGeneratedColumn("uuid") // indicates that id is an auto-generated Primary Key that looks like an uuid
  id: string;

  @Column() // if I don't pass anything, the column is by default a varchar
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude() // remove the password from the API response
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: "avatar_url" }) // the name to be returned in the API response
  get AvatarUrl(): string | null {
    // a simple get method that we just create here to get the avatar

    if (!this.avatar) {
      return null;
    }

    switch (uploadConfig.driver) {
      case "disk":
        return `${process.env.APP_API_URL}/files/${this.avatar}`;
      case "s3":
        return `https://s3-ap-southeast-2.amazonaws.com/${uploadConfig.config.aws.bucket}/${this.avatar}`;
      default:
        return null;
    }
  }
}

export default User;
