const {
  MessageEmbed,
  Formatters: { time }
} = require('discord.js');

module.exports = {
  name: 'approve',
  isTeamOnly: true,
  isBottumReviewerOnly: true,
  usage: [
    "botId",
  ],
  async execute(client, message, args) {
    let [bot] = args;

    if (!client.db.has(bot.id)) {
      await message.channel.send('That bot is not in the queue.');
      return;
    }

    const botData = client.db.get(bot.id);

    const modLogEmbed = new MessageEmbed()
      .setColor('GREEN')
      .addField('BOT NAME', botData.name)
      .addField('APPROVED BY', message.author.tag)
      .setDescription(`Approved at: ${time(new Date(), 'F')}`);

    // sends the bot owner a DM about their bots have been apporoved
    const owner = await client.users.fetch(botData.owner).catch(() => null);
    if (owner === null) {
      client.db.delete(id);
      await message.channel.send(
        'Looks like the owner of that bot has been deleted.'
      );
      return;
    }

    await owner
      .send({ content: 'WOOO! :tada: YOUR BOT HAS BEEN APPOROVED' })
      .catch(() => undefined);

    // send the log embed to mod logs channel;
    const log = client.channels.cache.get(client.botoptions.logs.modlogs);
    await log.send({ embeds: [modLogEmbed] });

    // make the approved option true on db;
    botData.approved = true;
    client.db.set(id, botData); // why does it sets it via id? it should write it to the bots array instead
    // true, i didnt modify the db stuff tho
    // we should do that,btw im setuping atlas rn
    // good
    // what was the lib for js? 
    // mongoose?
    // yardım me
  }
};
