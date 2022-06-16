import express from 'express';
import ejs from 'ejs';
import { resolve, join } from 'node:path';
import Core from '../core.js';

// Our dir (in this case /website/html)
const templateDir = resolve(join(process.cwd(), 'website', 'html'));

// The code to render the template
const renderTemplate = (res, template, data = {}) => {
  res.render(join(templateDir, template), Object.assign(data));
};

let app;

async function Init() {
  app = express();

  

  app.engine('html', ejs.renderFile);
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(express.json());
  app.use('/static', express.static(join(process.cwd(), 'website', 'public')));

  // The landing page
  app.get('/', async (_, res) => {
    console.log(Core.Database);
    const bots = await Core.Database.getApprovedBots();

    renderTemplate(res, 'landing.ejs', {
      currentBots: bots
    });
    
    Core.Logger.logStat(`:envelope: landing viewed`);
  });
  
  app.get('/botpage', (req, res) => {
    renderTemplate(res, 'botpage.ejs');
    Core.Logger.logStat(`:envelope: /botpage viewed`);
  });
  
  app.awaitListen = () => new Promise((resolve) => {
    app.listen(3000, () => {
      console.log('hi internet');
      resolve();
    });
  });
  
  await app.awaitListen();
  
  Core.App = app;
}

export default {
  Init,
  app,
}