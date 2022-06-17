import 'dotenv/config';

import Core from './core.js';
import Task from './utils/launchTask.js';

import LoggerLaunch from './common/logger.js';
import DBWrapper from './common/databaseWrapper.js';
import AppLaunch from './website/load.js';
import AriaLaunch from './aria/load.js';

const { MONGO_URI } = process.env;
let log;

// main function for starting OBL
async function Launch() {
  await LoggerLaunch.Init();

  await Task.Create('MongoDB connect', async () => {
    await DBWrapper.Init(process.env.MONGO_URI);
  });

  await Task.Create('Caching stuff', async () => {
    await Core.Database.updateLandingCache();
  });

  await Task.Create('Express server init', async () => {
    await AppLaunch.Init();
  });

  await Task.Create('Aria startup', async () => {
    await AriaLaunch.Init();
  });

  Core.Logger.logSuccess('OpenBotList has launched successfully');

  console.log('Launch success! :3');
}

Launch();
