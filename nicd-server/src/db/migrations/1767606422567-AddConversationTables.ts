import { MigrationInterface, QueryRunner } from "typeorm";

export class AddConversationTables1767606422567 implements MigrationInterface {
    name = 'AddConversationTables1767606422567'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversation_user" ("conversation_user_id" character varying(255) NOT NULL, "user_id" character varying(255) NOT NULL, "conversation_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_38c44674dacf56889de21679c69" PRIMARY KEY ("conversation_user_id"))`);
        await queryRunner.query(`CREATE TABLE "conversation" ("conversation_id" character varying(255) NOT NULL, "conversation_name" character varying(255), "image_url" character varying(255), "team_id" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_66e2b75e2704e382f3a4f2a5466" PRIMARY KEY ("conversation_id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("message_id" character varying(255) NOT NULL, "content" text NOT NULL, "conversation_id" character varying(255) NOT NULL, "sender_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_06a563cdbd963a9f7cbcb25c447" PRIMARY KEY ("message_id"))`);
        await queryRunner.query(`ALTER TABLE "conversation_user" ADD CONSTRAINT "FK_dd1bfd1e5714847c073bc9c1de7" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "conversation_user" ADD CONSTRAINT "FK_8cbad80d6f37636bc879e244360" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("conversation_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2" FOREIGN KEY ("conversation_id") REFERENCES "conversation"("conversation_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7fe3e887d78498d9c9813375ce2"`);
        await queryRunner.query(`ALTER TABLE "conversation_user" DROP CONSTRAINT "FK_8cbad80d6f37636bc879e244360"`);
        await queryRunner.query(`ALTER TABLE "conversation_user" DROP CONSTRAINT "FK_dd1bfd1e5714847c073bc9c1de7"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "conversation"`);
        await queryRunner.query(`DROP TABLE "conversation_user"`);
    }

}
