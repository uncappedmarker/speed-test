# Speed Test

A utility intended to sit and run speed tests on a cadence.

## PreReq

```bash
## If migrating from prior bintray install instructions please first...
# sudo rm /etc/apt/sources.list.d/speedtest.list
# sudo apt-get update
# sudo apt-get remove speedtest
## Other non-official binaries will conflict with Speedtest CLI
# Example how to remove using apt-get
# sudo apt-get remove speedtest-cli
sudo apt-get install curl
curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
sudo apt-get install speedtest
```

Then run `speedtest --accept-license`

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