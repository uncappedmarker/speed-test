import express, { Express, Request, Response } from "express";
const fs = require("fs");
const path = require("path");
const app = express();
const { exec } = require("child_process");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "speed-test" });
const { blankEntry } = require("../blank.json");
import { GraphProps } from "../../types/graphs";
import { Report } from "../../types/reports";

const config = require("config");
const INTERVAL = config.get("interval");
const PORT = config.get("port");
const COMMAND = config.get("command");
const OUTPUT_LOCATION = config.get("output_location");

// Make `output` folder if it doesn't exist
if (!fs.existsSync(path.resolve(OUTPUT_LOCATION))) {
	fs.mkdirSync(path.resolve(OUTPUT_LOCATION));
}

app.use(express.static("dist"));

app.get("/", (req: Request, res: Response) => {
	res.sendFile(__dirname + "/dist/index.html");
});

app.get("/data", (req: Request, res: Response) => {
	const allJSONFiles: string[] = fs.readdirSync(path.resolve("tests")).filter((each: string) => each.endsWith(".json"));
	let data: Report[] = [];
	allJSONFiles.map((each_name) => {
		const node = JSON.parse(fs.readFileSync(path.resolve("tests", each_name)));
		data.push(node);
	});
	res.json(data);
});

function recordTest() {
	// @ts-ignore
	exec(COMMAND, (err, stdout, stderr) => {
		let result: Report;
		if (err || stderr) {
			// Yell about it
			console.log(`Error @ ${new Date()}`);
			console.log(err, stderr);

			// Write a blank one
			result = { ...blankEntry, timestamp: new Date().toISOString().toString() };
		} else {
			result = JSON.parse(stdout);
		}

		const filename = path.resolve("tests", `${new Date().getTime()}.json`);
		fs.writeFileSync(filename, JSON.stringify(result));
	});
}

setInterval(
	() => {
		recordTest();
	},
	1000 * 60 * INTERVAL,
);

// Server
app.listen(PORT, recordTest);
