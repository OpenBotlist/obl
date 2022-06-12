const {
  Formatters: { hyperlink },
  MessageEmbed
} = require('discord.js');

module.exports = {
  name: 'queue',
  isBottumReviewerOnly: true,
  async execute(client, message) {
    // the queue system
    // BOT NAME (PREFIX) - INVITE (NO PERMS) - INVITE (8 PERMS)
    // if its apprvoed dont show it on the list

    const embed = new MessageEmbed().setTitle('***Queue***').setDescription(
      Object.values(client.DB)
        .filter((bot) => !bot.approved)
        .map((bot) => {
          const invite = `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot%20applications.commands&perms=`;

          return `${bot.name} (${bot.prefix}) - ${hyperlink(
            'invite (no perms)',
            `${invite}0`
          )} - ${hyperlink('invite (administrator perms)', `${invite}8`)}`;
        })
        .join('\n\n')
    );

    await message.channel.send({ embeds: [embed] });
  }
};
