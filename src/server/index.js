const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { exec } = require("child_process");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "speed-test" });

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

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/dist/index.html");
});

app.get("/data", (req, res) => {
	const allJSONFiles = fs.readdirSync(path.resolve("tests")).filter((each) => each.endsWith(".json"));
	let data = [];
	allJSONFiles.map((each_name) => {
		const node = JSON.parse(fs.readFileSync(path.resolve("tests", each_name)));
		data.push(node);
	});
	res.json(data);
});

function recordTest(callback) {
	exec(COMMAND, (err, stdout, stderr) => {
		if (err || stderr) {
			return res.send("Error while testing internet speed.");
		}
		const result = JSON.parse(stdout);
		const filename = path.resolve("tests", `${new Date().getTime()}.json`);
		fs.writeFileSync(filename, JSON.stringify(result));
		if (callback) {
			callback(result);
		}
		// log.info({ result }, `Test complete`);
	});
}

// Speed Test
app.post("/test", (req, res) => {
	recordTest((result) => {
		const response = `<center> 
			<h2>Ping : ${result.ping.latency}</h2> 
			<h2>Download Speed : ${result.download.bandwidth / 1000 / 100}</h2> 
			<h2>Upload Speed : ${result.upload.bandwidth / 1000 / 100}</h2> 
			</center>
			<a href="/">Back</a>
			`;
		res.send(response);
	});
});

setInterval(
	() => {
		recordTest();
	},
	1000 * 60 * INTERVAL,
);

// Server
app.listen(PORT, recordTest);
