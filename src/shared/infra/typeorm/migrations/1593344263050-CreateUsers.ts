import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsers1593344263050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Here we are creating a table users with 3 columns:
     * 1. column id of type varchar that is the primary key and uses uuid
     * 2. column provider of type varchar that can't be null
     * 3. column date of type timestamp with time zone (postgre exclusive) and can't be null
     */
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false,
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // method that drops the table
    await queryRunner.dropTable("users");
  }
}
