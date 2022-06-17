import { MongoClient } from 'mongodb';
import delay from '../utils/delay.js';
import OBL from '../core.js';

let _mongoClient = null;
let _mongoDb = null;
let Database = null;

class OblWrapper {
  constructor() {
    this.c = {};
    ['bots'].forEach((v) => {
      this.c[v] = _mongoDb.collection(v);
    });

    this.landingCache = [];
  }

  async updateLandingCache() {
    this.landingCache = await this.getApprovedBots(0, 200);
  }

  /// @returns Bot
  async getBotById(id) {
    return await this.c.bots.findOne({ id: id });
  }

  /// @returns Array<Bot>
  async getUnapprovedBots(page = 0, max = 20) {
    const cursor = await this.c.bots
      .find({ approved: false })
      .skip(page * max)
      .limit(max);

    return await cursor.toArray();
  }

  /// @returns Array<Bot>
  async getApprovedBots(page = 0, max = 200) {
    const cursor = await this.c.bots
      .find({ approved: true })
      .skip(page * max)
      .limit(max);

    return await cursor.toArray();
  }

  async getUnapprovedCount() {
    return await this.c.bots.countDocuments({ approved: true });
  }

  async setBotById(bot) {
    await this.c.bots.replaceOne(
      {
        id: bot.id
      },
      {
        ...bot
      },
      {
        upsert: true
      }
    );

    // dont forgor this:
    if (bot.approved) await this.updateLandingCache();
  }

  async deleteBot(id) {
    await this.c.bots.deleteOne({
      id: id
    });
  }

  async approveBot(id) {
    await this.c.bots.updateOne({ id }, { $set: { approved: true } });

    // dont forgor this:
    await this.updateLandingCache();
  }
}

async function Init(URI) {
  if (!URI) throw new Error('URI is null! How do you expect me to connect???');
  _mongoClient = new MongoClient(URI);
  try {
    await _mongoClient.connect();
  } catch (error) {
    // todo: log
    await delay(10 * 1000);
    return InitDB(URI);
  }
  _mongoDb = _mongoClient.db('obl');
  Database = new OblWrapper();
  OBL.Database = Database;
  return Database;
}

export default {
  Init,
  Database,

  // do not use - exposed for eval etc
  _mongoClient,
  _mongoDb
};
