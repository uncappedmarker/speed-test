# Speed Test

A utility intended to sit and run speed tests on a cadence.

## Installation

- Install speedtest CLI @ [speedtest.net/apps/cli](https://www.speedtest.net/apps/cli)
- Install Node 20.x
- Run `npm ci / npm start`

## Development

- `npm run dev`

## Config

- `interval` (number) - The interval the tests are expected to run
- `port` (number) - The port this runs on
- `output` (string) - The name of the folder we collect tests to
- `command` (string) - The command we run to get the speedtest