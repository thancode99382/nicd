import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationAndFeedbackTables1767528999121 implements MigrationInterface {
    name = 'AddNotificationAndFeedbackTables1767528999121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "feedback" ("feedback_id" character varying(255) NOT NULL, "content" character varying(1000) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05e0741767903afe9fca96d1e9d" PRIMARY KEY ("feedback_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "feedback"`);
    }

}
