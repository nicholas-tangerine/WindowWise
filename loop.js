import { CronJob } from 'cron'
import { sendDM } from './bot.js'
import { refresh } from './refresh.js'

const mailer = new CronJob(
  '*/3 * * * *',
  sendDM,
  null,
  true,
  'America/Los_Angeles'
);

/*const time_updater = new CronJob(
  '0 5 0 * *',
  refresh,
  null,
  true,
  'America/Los_Angeles'
)*/