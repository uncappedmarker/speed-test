const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const { exec } = require("child_process");

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/dist/index.html");
});

app.use(express.static("dist"));

app.get("/data", (req, res) => {
	const allJSONFiles = fs.readdirSync(path.resolve("tests")).filter(each => each.endsWith(".json"));
	let data = [];
	allJSONFiles.map(each_name => {
		const node = JSON.parse(fs.readFileSync(path.resolve("tests", each_name)))
		data.push(node);
	})
	res.json(data);
});

function recordTest(callback) {
	exec("speedtest -f json-pretty -u bps", (err, stdout, stderr) => { 
		if (err || stderr) {
		return res.send( 
			"Error while testing internet speed."); 
		}
		const result = JSON.parse(stdout);
		const filename = path.resolve( "tests", `${new Date().getTime()}.json`);
		fs.writeFileSync(filename, JSON.stringify(result));
		if (callback) {
			callback(result);
		}
		console.log(`Did test @ ${new Date()}`)
	}); 
}

// Speed Test 
app.post("/test", (req, res) => {
	recordTest(result => {
		const response = `<center> 
			<h2>Ping : ${result.ping.latency}</h2> 
			<h2>Download Speed : ${(result.download.bandwidth/1000)/100}</h2> 
			<h2>Upload Speed : ${result.upload.bandwidth/1000/100}</h2> 
			</center>
			<a href="/">Back</a>
			`; 
		res.send(response); 
	})
});

const HOUR = 1000 * 60 * 60;

setInterval(() => {
	recordTest();
}, HOUR);

// Server 
app.listen(4000, recordTest);