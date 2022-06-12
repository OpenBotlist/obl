/*
  This Source Code Form is subject to the terms of the GNU General Public License:

     Copyright (C) 2021-2022 OPENBOTLIST  
    
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program. If not, see https://www.gnu.org/licenses/.
*/

const { Client, Collection } = require('discord.js');
const { writeFileSync, readFileSync } = require('node:fs');
const dbpath = './src/database.json';
const { loadCommands, loadEvents } = require('./util/loaders');

const client = new Client({ disableEveryone: true, intents: 98303 }); // is 98303 enougth? -no

let DB = {};

class db {
  static load() {
    DB = JSON.parse(readFileSync(dbpath).toString());
  }
  static save() {
    writeFileSync(dbpath, JSON.stringify(DB));
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
  static push(id, value) { 
    let getFirst = db.get(id)
    getFirst.push(value)
    db.set(id, getFirst)
  }
}

db.load();

client.botoptions = {
  prefix: '!',
  token: process.env.token, // token reaveal
  logs: {
    modlogs: '966028505458556968'
  },
  team: ['396571938081865741', '544676649510371328', '985611236752371762'],
  bottumrev: ['928624781731983380','396571938081865741', '985611236752371762'],
  ashley: ['396571938081865741', '985611236752371762'], // HE HE HE HA *clash royale sfx*
  add_bot: '966397896176058428'
};

client.db = db;

client.usages = {
  prefix: {
    max: 10,
  },
  botId: {
    type: "user",
    bot: true,
  },
  shortDesc: {
    max: 150,
    rest: true,
  },
  declineReason: {
    rest: true,
  }
}
 

client.commands = new Collection();
loadCommands(client);
loadEvents(client);

client.login(client.botoptions.token);
