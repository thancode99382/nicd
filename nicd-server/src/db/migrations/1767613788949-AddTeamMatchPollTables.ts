import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamMatchPollTables1767613788949 implements MigrationInterface {
    name = 'AddTeamMatchPollTables1767613788949'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."team_user_role_enum" AS ENUM('normal', 'captain', 'deputy_captain')`);
        await queryRunner.query(`CREATE TYPE "public"."team_user_status_enum" AS ENUM('pending', 'active', 'inactive')`);
        await queryRunner.query(`CREATE TABLE "team_user" ("team_user_id" character varying(255) NOT NULL, "team_id" character varying(255) NOT NULL, "user_id" character varying(255) NOT NULL, "role" "public"."team_user_role_enum" NOT NULL DEFAULT 'normal', "status" "public"."team_user_status_enum" NOT NULL DEFAULT 'pending', "position" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1dfd68247f603439a2e3e03a544" PRIMARY KEY ("team_user_id"))`);
        await queryRunner.query(`CREATE TABLE "team" ("team_id" character varying(255) NOT NULL, "team_name" character varying(255) NOT NULL, "url" character varying(255), "color_jersey" character varying(255), "location" character varying(255), "level" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a35a345d4436b82adf6bb76f3ce" PRIMARY KEY ("team_id"))`);
        await queryRunner.query(`CREATE TABLE "match" ("match_id" character varying(255) NOT NULL, "location" character varying(255), "opponent_name" character varying(255) NOT NULL, "time" TIMESTAMP NOT NULL, "team_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2e7d516f3dc97d9e2f882212d2b" PRIMARY KEY ("match_id"))`);
        await queryRunner.query(`CREATE TABLE "poll" ("poll_id" character varying(255) NOT NULL, "poll_content" text NOT NULL, "match_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fea7e58622d9df65f731cff0f3d" PRIMARY KEY ("poll_id"))`);
        await queryRunner.query(`CREATE TABLE "team_user_poll" ("team_user_poll_id" character varying(255) NOT NULL, "poll_id" character varying(255) NOT NULL, "team_user_id" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ccccba389ba6a0433ed79a9476d" PRIMARY KEY ("team_user_poll_id"))`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_ed60beadf0e6dffb2b9a5d164e4" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_user" ADD CONSTRAINT "FK_32437794ab1a0519530561ea159" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "match" ADD CONSTRAINT "FK_be0adf0634e99e9ef4420fec9ae" FOREIGN KEY ("team_id") REFERENCES "team"("team_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "poll" ADD CONSTRAINT "FK_383a2361d9a65feb1c3a4144cf6" FOREIGN KEY ("match_id") REFERENCES "match"("match_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_user_poll" ADD CONSTRAINT "FK_97606c17497e7609c16f004f9d9" FOREIGN KEY ("poll_id") REFERENCES "poll"("poll_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_user_poll" ADD CONSTRAINT "FK_ba0604527e53d1d696c26d33d9e" FOREIGN KEY ("team_user_id") REFERENCES "team_user"("team_user_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_user_poll" DROP CONSTRAINT "FK_ba0604527e53d1d696c26d33d9e"`);
        await queryRunner.query(`ALTER TABLE "team_user_poll" DROP CONSTRAINT "FK_97606c17497e7609c16f004f9d9"`);
        await queryRunner.query(`ALTER TABLE "poll" DROP CONSTRAINT "FK_383a2361d9a65feb1c3a4144cf6"`);
        await queryRunner.query(`ALTER TABLE "match" DROP CONSTRAINT "FK_be0adf0634e99e9ef4420fec9ae"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_32437794ab1a0519530561ea159"`);
        await queryRunner.query(`ALTER TABLE "team_user" DROP CONSTRAINT "FK_ed60beadf0e6dffb2b9a5d164e4"`);
        await queryRunner.query(`DROP TABLE "team_user_poll"`);
        await queryRunner.query(`DROP TABLE "poll"`);
        await queryRunner.query(`DROP TABLE "match"`);
        await queryRunner.query(`DROP TABLE "team"`);
        await queryRunner.query(`DROP TABLE "team_user"`);
        await queryRunner.query(`DROP TYPE "public"."team_user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."team_user_role_enum"`);
    }

}
