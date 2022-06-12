const {
  MessageEmbed,
  Formatters: { time }
} = require('discord.js');

module.exports = {
  name: 'decline',
  isBottumReviewerOnly: true,
  usage: [
    "botId",
    "declineReason"
  ],
  async execute(client, message, args) {
    let [bot, reason] = args;

    if (!client.db.has(bot.id)) {
      await message.channel.send('That bot is not in the queue.');
      return;
    }

    const botData = client.db.get(id);
    const modLogEmbed = new MessageEmbed()
      .setColor('RED')
      .addField('BOT NAME', botData.name)
      .addField('DECLINED BY', message.author.tag)
      .addField('REASON', reason)
      .setDescription(`Declined at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been declined
    const owner = await client.users.fetch(botData.owner).catch(() => null);

    if (owner === null) {
      client.db.delete(id);
      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );
      return;
    }

    await owner
      .send({
        content: `NOOO.... YOUR BOT HAVE BEEN DECLINED FOR THIS REASON: ${reason}`
      })
      .catch(() => undefined);
    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botoptions.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    client.db.delete(id);
  }
};
