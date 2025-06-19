# Speedtest

## About

This is intended to take speedtests intermittently using the speedtest-cli from [speedtest.net](https://www.speedtest.net/apps/cli). It will then write them to a mysql database.

## Setup for Deployment

### 1. **Install [speedtest-cli](https://www.speedtest.net/apps/cli) v2**:

This is really annoying. You have to uninstall `speedtest` and install `speedtest-cli` if it's already installed.

```bash
curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
```

```bash
sudo apt-get install speedtest-cli
```

### 2. **Verify it installed correctly**:

```bash
$ speedtest-cli --version
speedtest-cli 2.1.3
Python 3.11.2 (main, Nov 30 2024, 21:22:50) [GCC 12.2.0]
```

## Deployment

### 1. **Install Dependencies**:

```bash
npm ci
```

### 2. **Set up config**

```bash
touch config/local.json
```

### 3. **Make Cron Job**:

1. Open Crontab

   ```bash
   crontab -e
   ```

2. Figure out where `npm` lives

   ```bash
   which npm
   ```

3. Set for every 5 minutes. This cron job runs every 5 minutes. It executes a compiled Node.js script using a specific Node 22 binary installed via NVM. It sets the `NODE_CONFIG_DIR` environment variable to ensure the `config` package loads configuration files from the correct directory. All standard output and errors are logged to a file named `cron.log` in the project folder.

```bash
*/5 * * * * NODE_CONFIG_DIR=/home/jaime/Documents/speed-test/config /home/jaime/.nvm/versions/node/v22.16.0/bin/node /home/jaime/Documents/speed-test/dist/main.js >> /home/jaime/Documents/speed-test/cron.log 2>&1
```

### Cron Details Because I'll Forget

🕒 `*/5 * * * *`

- This is the **cron schedule expression**.
- It means: **every 5 minutes**, regardless of hour, day, month, or weekday.
- Breakdown:

  - `*/5` → every 5 minutes
  - `*` → every hour
  - `*` → every day of the month
  - `*` → every month
  - `*` → every day of the week

---

🌍 `NODE_CONFIG_DIR=/home/jaime/Documents/speed-test/config`

- This sets an **environment variable** for the cron job.
- It tells the [`config`](https://www.npmjs.com/package/config) package to look in this specific directory for configuration files like `default.json` or `production.json`.

---

🧠 `/home/jaime/.nvm/versions/node/v22.16.0/bin/node`

- This is the **full path to the Node.js binary** you're using (installed via NVM).
- Cron jobs don't inherit your shell’s PATH, so using the full path ensures it runs the correct version.

---

📜 `/home/jaime/Documents/speed-test/dist/main.js`

- This is the **compiled JavaScript entry file** for your project.
- It’s the file you want to execute every 5 minutes using Node.js.

---

🪵 `>> /home/jaime/Documents/speed-test/cron.log 2>&1`

- This handles **logging**:

  - `>>` appends the output (instead of overwriting the file).
  - `/home/jaime/Documents/speed-test/cron.log` is the log file.
  - `2>&1` redirects **stderr (2)** to the **same place as stdout (1)**, so both standard output and errors go into the same log file.

## Developing

### 1. **Install dependencies**:

```bash
npm ci
```

### 2. **Compile TypeScript**:

```bash
npm run dev
```
