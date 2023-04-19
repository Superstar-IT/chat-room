import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatHistoryEntity1681904254559
  implements MigrationInterface
{
  name = 'CreateChatHistoryEntity1681904254559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_history" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "content" text NOT NULL, "senderId" uuid, "roomId" uuid, CONSTRAINT "PK_cf76a7693b0b075dd86ea05f21d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_history" ADD CONSTRAINT "FK_ee4731d2d922c5acdaeaf9755de" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_history" ADD CONSTRAINT "FK_262e69d4d42a0817932fcc724e0" FOREIGN KEY ("roomId") REFERENCES "chat_room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "chat_history" DROP CONSTRAINT "FK_262e69d4d42a0817932fcc724e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_history" DROP CONSTRAINT "FK_ee4731d2d922c5acdaeaf9755de"`,
    );
    await queryRunner.query(`DROP TABLE "chat_history"`);
  }
}
