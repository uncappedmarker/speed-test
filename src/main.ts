// To be run with a cron job
import bunyan from "bunyan";
const log = bunyan.createLogger({ name: "speed-test" });
import mysql from "mysql2/promise";
import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { SpeedtestResult } from "./types/tests";
import { v4 as uuidv4 } from "uuid";

import config from "config";
const MACHINE_ID: number = config.get("machine_id");
// If the machine id isn't a number or is less than 1, throw an error and don't start
if (isNaN(MACHINE_ID) || MACHINE_ID < 1) {
	const errorMessage = `Machine ID is not a number or is less than 1: ${MACHINE_ID}`;
	log.error(errorMessage);
	throw new Error(errorMessage);
}

const ERROR_LOG_FILENAME: string = "error.log";
const ERROR_LOG = path.resolve("./", ERROR_LOG_FILENAME);
const COMMAND: string = config.get("command");
const DB_CONFIG: {
	user: string;
	host: string;
	database: string;
	password: string;
	port: number;
} = config.get("db");

async function createConnection(): Promise<mysql.Connection> {
	const connection = await mysql.createConnection(DB_CONFIG);
	return connection;
}

async function main() {
	// Assert output error file
	if (!fs.existsSync(ERROR_LOG)) {
		fs.writeFileSync(ERROR_LOG, "", "utf-8");
	}

	let result: SpeedtestResult;
	exec(COMMAND, async (err, stdout, stderr) => {
		if (err || stderr) {
			// Try to record it

			// Make a unique UUID for the result
			const uuid = uuidv4();

			const insertQuery = `
				INSERT INTO zamboni.test_failures (
					error_message,
					test_timestamp,
					from_machine,
					uuid
				)
				VALUES (?, ?, ?, ?)
			`;
			const values = [
				stderr || err?.message || "unknown error",
				new Date(),
				MACHINE_ID,
				uuid,
			];

			const client = await createConnection();
			client.execute(insertQuery, values);
			await client.end();

			// Yell about it
			log.error({ err, stderr }, `Error @ ${new Date()}`);
			fs.appendFileSync(
				ERROR_LOG,
				`${new Date().toString()}: ${stderr}`,
				"utf-8"
			);
		} else {
			result = JSON.parse(stdout);

			// Make a unique UUID for the result
			const uuid = uuidv4();

			const insertQuery = `
                INSERT INTO zamboni.test_results (
                    download,
                    upload,
                    ping,
                    isp,
					test_timestamp,
                    from_machine,
					uuid
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
			const values = [
				result.download,
				result.upload,
				result.ping,
				result.client.isp,
				result.timestamp,
				MACHINE_ID,
				uuid,
			];

			const client = await createConnection();
			client.execute(insertQuery, values);
			await client.end();
		}
	});
}

(async () => {
	log.debug(`Starting speed test @ ${new Date()}`);
	await main();
})();
