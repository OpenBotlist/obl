import { MessageEmbed, Formatters } from 'discord.js';

const { time } = Formatters;

export default {
  name: 'decline',
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  usage: ['unapprovedBot', {
    name: "declineReason",
    rest: true,
  }],
  async execute(client, message, args) {
    let [ bot, declineReason ] = args;

    // sends the bot owner a DM about their bots have been declined
    const owner = await client.users.fetch(bot.ownerID).catch(() => null);

    if (owner === null) {
      await Database.deleteBot(bot.id);
      await message.reply('Looks like the owner of that bot has been deleted.');
      return;
    }
    
    Core.Logger.logEvent(`:x: **${message.author.username}** (${message.author.id}) declined **${bot.username}** (${bot.id})!`);

    await owner
      .send({
        content: `Your bot has been declined for the following reason: ${reason}`
      })
      .catch(() => undefined);

    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botOptions.logs.modlogs);

    if (log !== undefined) {
      const modLogEmbed = new MessageEmbed()
        .setColor('RED')
        .addField('BOT NAME', bot.name)
        .addField('DECLINED BY', message.author.tag)
        .setDescription(`Declined at: ${time(new Date(), 'F')}`);

      await log.send({ embeds: [modLogEmbed] });
    }

    await Database.deleteBot(bot.id);
  }
};
