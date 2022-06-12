const express = require('express');
const { resolve, join } = require('node:path');
const fs = require("node:fs")
const app = express();

const dbpath = './src/database.json';  // OLDU MUUUUUUUUUU 


let DB = {};

class db {
  static load() {
    DB = JSON.parse(fs.readFileSync(dbpath).toString());
  }
  static save() {
    fs.writeFileSync(dbpath, JSON.stringify(DB));
  }
  static get(id) {
    if (!DB[id]) return null;
    return JSON.parse(JSON.stringify(DB[id])); // string -> parse :: deep copy
  }
  static set(id, val) {
    DB[id] = val;
    db.save();
  }
  static add(id, val) {
    if (!DB[id]) DB[id] = 0;
    DB[id] = Number(DB[id]) + val;
    db.save();
  }
  static async fetch(id) {
    return db.get(id);
  }
  static has(id) {
    return Boolean(DB[id]);
  }
  static delete(id) {
    return delete DB[id];
  }
}

db.load()


// Our dir (in this case /website/html)
const templateDir = resolve(join(process.cwd(), 'website', 'html'));

// The code to render the template
const renderTemplate = (res, template, data = {}) => {
  res.render(resolve(join(templateDir, template)), Object.assign(data));
};

app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json());

// The landing page
app.get('/', (_, res) => {
  renderTemplate(res, 'landing.ejs');
});

app.get('/discover', (_, res) => {
  console.log(db.get("bots"))
  renderTemplate(res, "bots.ejs", {
     currentBots: db.get("bots")
  });
});
app.use('/static', express.static(join(__dirname, 'public')));
app.get('/*', (_, res) => {
  renderTemplate(res, '404.ejs');
});
app.listen(3000, () => {
  console.log('hi internet');
});
