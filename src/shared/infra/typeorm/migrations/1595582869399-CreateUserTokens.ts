import { MigrationInterface, QueryRunner, Table } from "typeorm";

export default class CreateUserTokens1595582869399 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_tokens",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "token",
            type: "uuid",
            generationStrategy: "uuid",
            default: "uuid_generate_v4()",
          },
          {
            name: "user_id",
            type: "uuid",
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
        foreignKeys: [
          {
            name: "TokenUser", // a name for reference
            referencedTableName: "users", // the table it's linked to
            referencedColumnNames: ["id"], // the column in the table above that contains the primary key
            columnNames: ["user_id"], // the column in this table that contains the foreign key
            onDelete: "CASCADE", // what happens when the primary key is deleted
            onUpdate: "CASCADE", // what happens when the primary key is updated
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_tokens");
  }
}
