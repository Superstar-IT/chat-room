import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateChatRoomEntity1681876621096 implements MigrationInterface {
  name = 'CreateChatRoomEntity1681876621096';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "chat_room" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "creator" uuid NOT NULL, "name" character varying NOT NULL, "members" jsonb NOT NULL DEFAULT '[]', CONSTRAINT "PK_8aa3a52cf74c96469f0ef9fbe3e" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "chat_room"`);
  }
}
