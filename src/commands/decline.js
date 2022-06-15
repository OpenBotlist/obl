import { MessageEmbed, Formatters } from 'discord.js';

const { time } = Formatters;

export default {
  name: 'decline',
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  usage: ['botId', 'declineReason'],
  async execute(client, message, args) {
    const id = args[0],
      reason = args.slice(1).join(' ');

    const bots = client.db.collection('bots');

    const entry = await bots.findOne({ id });

    if (entry === null) {
      await message.reply({ content: 'That bot is not in the queue.' });

      return;
    }

    // sends the bot owner a DM about their bots have been declined
    const owner = await client.users.fetch(entry.ownerID).catch(() => null);

    if (owner === null) {
      await bots.deleteOne({ id });

      await message.reply('Looks like the owner of that bot has been deleted.');

      return;
    }

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
        .addField('BOT NAME', entry.name)
        .addField('DECLINED BY', message.author.tag)
        .setDescription(`Declined at: ${time(new Date(), 'F')}`);

      await log.send({ embeds: [modLogEmbed] });
    }

    await bots.deleteOne({ id });
  }
};
