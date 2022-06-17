import { MessageEmbed, Formatters } from 'discord.js';

import Core from '../../core.js';
const { Database } = Core;

const { time } = Formatters;

export default {
  name: 'approve',
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  usage: 'unapprovedBot',
  async execute(client, message, args) {
    const [bot] = args;

    // sends the bot owner a DM about their bots have been approved
    const owner = await client.users.fetch(bot.ownerID).catch(() => null);

    if (owner === null) {
      await Database.deleteBot(bot.id);
      await message.reply('Looks like the owner of that bot has been deleted.');
      return;
    }

    await owner
      .send({ content: 'WOOO! :tada: YOUR BOT HAS BEEN APPOROVED' })
      .catch(() => undefined);

    Core.Logger.logEvent(
      `:tada: **${message.author.username}** (${message.author.id}) approved **${bot.username}** (${bot.id})!`
    );

    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botOptions.logs.modlogs);

    if (log !== undefined) {
      const modLogEmbed = new MessageEmbed()
        .setColor('GREEN')
        .addField('BOT NAME', bot.name)
        .addField('APPROVED BY', message.author.tag)
        .setDescription(`Approved at: ${time(new Date(), 'F')}`);

      await log.send({ embeds: [modLogEmbed] });
    }

    // make the approved option true on db;
    await Database.approveBot(bot.id);
  }
};
