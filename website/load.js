import express from 'express';
import ejs from 'ejs';
import { resolve, join } from 'node:path';
import database from '../database.js';

const app = express();

// Our dir (in this case /website/html)
const templateDir = resolve(join(process.cwd(), 'website', 'html'));

// The code to render the template
const renderTemplate = (res, template, data = {}) => {
  res.render(join(templateDir, template), Object.assign(data));
};

app.engine('html', ejs.renderFile);
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json());
app.use('/static', express.static(join(process.cwd(), 'website', 'public')));

// The landing page
app.get('/', async (_, res) => {
  const bots = await database.collection('bots').find().toArray();

  renderTemplate(res, 'landing.ejs', {
    currentBots: bots
  });
});
app.get('/botpage', (req, res) => {
  renderTemplate(res, 'botpage.ejs');
});
// app.get('/*', (_, res) => {
//   renderTemplate(res, '404.ejs');
// });
app.listen(3000, () => {
  console.log('hi internet');
});
