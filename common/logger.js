import { WebhookClient } from 'discord.js';
import { MessageEmbed, Formatters } from 'discord.js';
import { inspect } from 'node:util';

const { codeBlock } = Formatters;
import Core from '../core.js';

const LogType = {
  
}

class Logger {
  async init() {
    _webhook = new WebhookClient({
      id: process.env.LoggerID,
      token: process.env.LoggerToken,
    });
    
    this.w = _webhook;
    this.statsPool = [];
    this.statsPostInterval = setInterval(() => this.postStats(), 5 * 1000);
    //await this.log("> *Delta Logger System:tm: initialized owo*");
  }
  
  async log(typ, str) {
    if(!str) {
      str = typ;
      typ = null;
    }
    
    if(typeof str === "string") {
      str = { content: str };
    };
    
    this.w.send({
      ...str,
      threadId: typ,
    })
  }
  
  async logEvent(str) {
    await this.log(Core.LogType.Event, str);
  }
  
  async logStat(str) {
    this.statsPool.push(str);
  }
  
  async postStats() {
    if (this.statsPool.length == 0) return;
    await this.log(Core.LogType.Stats, this.statsPool.join("\n"));
    this.statsPool = [];
  }
  
  async logSuccess(typ, str) {
    if(!str) {
      str = typ;
      typ = null;
    }
    
    if(typeof str === "string") {
      str = { content: str };
    };
    
    str.content = codeBlock("diff", "+" + str.content);
    
    this.w.send({
      ...str,
      threadId: typ,
    })
  }
}

let _webhook = null;
let logger = null;

async function Init() {
  logger = new Logger();
  
  await logger.init();
  
  Core.Logger = logger;
  return logger;
}

export default {
  Init,
  
  logger,
  _webhook,
};