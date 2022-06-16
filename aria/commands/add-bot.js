import Core from '../../core.js';
const { Database } = Core;

export default {
  name: 'add-bot',
  isAddBotChannelOnly: true,
  usage: [{
    name: "botId",
    type: "unregisteredBot"
  },
  {
    name: "prefix", 
    type: "text", 
    max: 10,
  }, 
  {
    name: 'shortDesc',
    type: "text",
    max: 150,
    rest: true,
  }],
  async execute(client, message, args) {
    const [bot, prefix, shortDesc] = args;
    
    Core.Logger.logEvent(`:package: **${message.author.username}** (${message.author.id}) added **${bot.username}** (${bot.id}) to queue`);

    await Database.setBotById({
      id: bot.id,
      name: bot.username,
      avatarURL: bot.displayAvatarURL({ format: 'png' }),
      prefix,
      shortDesc,
      approved: false,
      ownerID: message.author.id,
      platform: "discord",
    });

    await message.author
      .send('Your bot has been added to the queue!')
      .catch(() => undefined); // send it to DMs
    await message.delete().catch(() => undefined); // this should delete the command message (!add-bot)
  }
};
