import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export default class AddUserIdToAppointments1595910524323 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // we use addColumn() and we pass the table where we want to add the column and then the information for the column
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "user_id",
        type: "uuid",
        isNullable: true,
      })
    );

    /**
     * This creates the foreign key/relationship between appointments and user
     */
    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "AppointmentUser",
        columnNames: ["user_id"], // the column inside appointments that will  hold the foreign key
        referencedColumnNames: ["id"], // the column inside the foreign table that has the unique identifier
        referencedTableName: "users", // the name of the table that this reference links to
        onDelete: "SET NULL", // upon user deletion, set the provider_id as null
        onUpdate: "CASCADE", // in case the user ID changed, it updates it also in the relationships
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    /**
     * Now we need to undo everything we did in the up() method, including the foreign key relationship
     * We start by deleting the foreign key and they we delete the column.
     * Lastly, we have to re-create the column as it was before
     */
    await queryRunner.dropForeignKey("appointments", "AppointmentProvider");

    await queryRunner.dropColumn("appointments", "user_id");
  }
}
