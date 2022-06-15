import { MessageEmbed, Formatters } from 'discord.js';

const { time } = Formatters;

export default {
  name: 'approve',
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  usage: ['botId'],
  async execute(client, message, args) {
    const [id] = args;

    const bots = client.db.collection('bots');

    const entry = await bots.findOne({ id });

    if (entry === null) {
      await message.reply({ content: 'That bot is not in the queue.' });

      return;
    }

    // sends the bot owner a DM about their bots have been approved
    const owner = await client.users.fetch(entry.ownerID).catch(() => null);

    if (owner === null) {
      await bots.deleteOne({ id });

      await message.reply('Looks like the owner of that bot has been deleted.');

      return;
    }

    await owner
      .send({ content: 'WOOO! :tada: YOUR BOT HAS BEEN APPOROVED' })
      .catch(() => undefined);

    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botOptions.logs.modlogs);

    if (log !== undefined) {
      const modLogEmbed = new MessageEmbed()
        .setColor('GREEN')
        .addField('BOT NAME', entry.name)
        .addField('APPROVED BY', message.author.tag)
        .setDescription(`Approved at: ${time(new Date(), 'F')}`);

      await log.send({ embeds: [modLogEmbed] });
    }

    // make the approved option true on db;
    await bots.updateOne({ id }, { $set: { approved: true } });
  }
};
