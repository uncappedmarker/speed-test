// To be run with a cron job
import bunyan from "bunyan";
const log = bunyan.createLogger({ name: "speed-test" });
import mysql from "mysql2/promise";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import config from "config";
const MACHINE_ID = config.get("machine_id");
// If the machine id isn't a number or is less than 1, throw an error and don't start
if (isNaN(MACHINE_ID) || MACHINE_ID < 1) {
    const errorMessage = `Machine ID is not a number or is less than 1: ${MACHINE_ID}`;
    log.error(errorMessage);
    throw new Error(errorMessage);
}
const DB_CONFIG = config.get("db");
async function createConnection() {
    const connection = await mysql.createConnection(DB_CONFIG);
    return connection;
}
const TESTS_DIR = path.resolve("./tests");
if (!fs.existsSync(TESTS_DIR)) {
    log.error(`Tests directory does not exist: ${TESTS_DIR}`);
    process.exit(1);
}
async function main() {
    const connection = await createConnection();
    const files = fs.readdirSync(TESTS_DIR);
    for (const file of files) {
        if (!file.endsWith(".json"))
            continue;
        const filePath = path.join(TESTS_DIR, file);
        let data;
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            data = JSON.parse(content);
        }
        catch (err) {
            console.error(`Failed to read or parse ${file}:`, err);
            continue;
        }
        const uuid = data?.result?.id || uuidv4();
        // Check for existence
        // @ts-ignore
        const [results] = await connection.execute("SELECT 1 FROM zamboni.test_results WHERE from_machine = ? AND uuid = ? LIMIT 1", [MACHINE_ID, uuid]);
        if (results.length > 0) {
            console.log(
            // @ts-ignore
            `Entry already exists for machine_id=${MACHINE_ID}, uuid=${uuid}. Skipping ${file}`);
            fs.unlinkSync(filePath);
            continue;
        }
        // Use the same insert query as main.ts (adjust columns as needed)
        try {
            const insertQuery = `
                INSERT INTO zamboni.test_results (
                    download,
                    upload,
                    ping,
                    isp,
                    timestamp,
                    from_machine,
					uuid
                )
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [
                // @ts-ignore
                data.download.bandwidth,
                // @ts-ignore
                data.upload.bandwidth,
                // @ts-ignore
                data.ping.latency,
                // @ts-ignore
                data.isp,
                // @ts-ignore
                data.timestamp,
                // @ts-ignore
                MACHINE_ID,
                // @ts-ignore
                uuid,
            ];
            // @ts-ignore
            await connection.execute(insertQuery, values);
            console.log(`Inserted ${file}`);
            // @ts-ignore
            await fs.unlinkSync(filePath);
        }
        catch (err) {
            console.error(`Failed to insert ${file}:`, err);
        }
    }
    // @ts-ignore
    await connection.end();
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
