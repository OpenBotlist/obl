import Core from '../../core.js';

export default {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} is online`);
    Core.MasterGuild = await client.guilds.fetch(process.env.MASTER_GUILD_ID);
  }
};
