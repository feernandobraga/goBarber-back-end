import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAppointments1593331382030 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    /**
     * Here we are creating a table appointments with 3 columns:
     * 1. column id of type varchar that is the primary key and uses uuid
     * 2. column provider of type varchar that can't be null
     * 3. column date of type timestamp with time zone (postgre exclusive) and can't be null
     */
    await queryRunner.createTable(
      new Table({
        name: "appointments",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "provider",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "date",
            type: "timestamp with time zone",
            isNullable: false,
          },
          {
            // when the appointment was created
            name: "created_at",
            type: "timestamp",
            default: "now()", // runs the default action when the row is created. In this case takes a timestamp of the current time
          },
          {
            // when the appointment was updated
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
    await queryRunner.dropTable("appointments");
  }
}
