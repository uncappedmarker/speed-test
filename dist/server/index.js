"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = require("fs");
const path = require("path");
const app = (0, express_1.default)();
const { exec } = require("child_process");
const bunyan = require("bunyan");
const log = bunyan.createLogger({ name: "speed-test" });
const { blankEntry } = require("../blank.json");
const config = require("config");
const INTERVAL = config.get("interval");
const PORT = config.get("port");
const COMMAND = config.get("command");
const OUTPUT_LOCATION = config.get("output_location");
// Make `output` folder if it doesn't exist
if (!fs.existsSync(path.resolve(OUTPUT_LOCATION))) {
    fs.mkdirSync(path.resolve(OUTPUT_LOCATION));
}
app.use(express_1.default.static("dist"));
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
function recordTest() {
    // @ts-ignore
    exec(COMMAND, (err, stdout, stderr) => {
        let result;
        if (err || stderr) {
            // Yell about it
            console.log(`Error @ ${new Date()}`);
            console.log(err, stderr);
            // Write a blank one
            result = Object.assign(Object.assign({}, blankEntry), { timestamp: new Date().toISOString().toString() });
        }
        else {
            result = JSON.parse(stdout);
        }
        const filename = path.resolve("tests", `${new Date().getTime()}.json`);
        fs.writeFileSync(filename, JSON.stringify(result));
    });
}
setInterval(() => {
    recordTest();
}, 1000 * 60 * INTERVAL);
// Server
app.listen(PORT, recordTest);
