## Deployment

1. **Install [speedtest-cli](https://www.speedtest.net/apps/cli) v2**:

   ```bash
   curl -s https://packagecloud.io/install/repositories/ookla/speedtest-cli/script.deb.sh | sudo bash
   ```

   ```bash
   sudo apt-get install speedtest
   ```

2. **Install Dependencies**:

   ```bash
   npm ci
   ```

3. **Make Cron Job**:

   Open Crontab

   ```bash
   crontab -e
   ```

   Set for every 30 minutes

   ```bash
   */30 * * * * cd ~/Documents/speedtest && /usr/bin/npm start >> ~/Documents/speedtest/cron.log 2>&1
   ```

## Developing

1. **Install dependencies**:

   ```bash
   npm ci
   ```

2. **Compile TypeScript**:
   ```bash
   npm run dev
   ```
