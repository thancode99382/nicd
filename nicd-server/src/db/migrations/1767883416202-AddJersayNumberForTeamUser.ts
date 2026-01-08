import { MigrationInterface, QueryRunner } from "typeorm";

export class AddJersayNumberForTeamUser1767883416202 implements MigrationInterface {
    name = 'AddJersayNumberForTeamUser1767883416202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_user" ADD "jersey_number" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_user" DROP COLUMN "jersey_number"`);
    }

}
