import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
} from "typeorm";

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
@Entity("user_tokens") // users is the name of the table in the database
class UserToken {
  @PrimaryGeneratedColumn("uuid") // indicates that id is an auto-generated Primary Key that looks like an uuid
  id: string;

  @Column()
  @Generated("uuid") // indicates that id is an auto-generated Primary Key that looks like an uuid
  token: string;

  @Column()
  user_id: string;

  @CreateDateColumn({ default: () => "Date.NOW()" })
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default UserToken;
