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

import { Client, Collection } from 'discord.js';
import { loadCommands, loadEvents } from './util/loaders.js';
import { join } from 'node:path';
import Core from '../core.js';

let client;

async function Init() {
  client = new Client({ intents: 98303 });

  client.botOptions = {
    prefix: '!',
    token: process.env.token, // token reaveal
    logs: {
      modlogs: '966028505458556968'
    },
    team: ['396571938081865741', '544676649510371328', '985611236752371762'],
    bottumrev: '966269411260502026',
    ashley: ['396571938081865741'],
    add_bot: '966397896176058428',
    addBotDelMessages: true // set to false if debugging
  };

  client.usages = {
    prefix: {
      max: 10
    },
    botId: {
      type: 'user',
      bot: true
    },
    shortDesc: {
      max: 150,
      rest: true
    },
    declineReason: {
      rest: true
    },
    code: {},

    savedBot: {
      type: 'text',

      async parse(input, settings) {}
    },

    approvedBot: {},

    unapprovedBot: {
      type: 'savedBot',

      approved: false
    }
  };

  client.frameworkDirectory = join(process.cwd(), 'aria');
  client.commands = new Collection();
  await loadCommands(client);
  await loadEvents(client);

  await client.login(client.botOptions.token);

  Core.Client = client;
}

export default {
  Init,
  client
};
