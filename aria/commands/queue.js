import { Formatters, MessageEmbed } from 'discord.js';

import Core from '../../core.js';
const { Database } = Core;

const { hyperlink } = Formatters;

export default {
  name: 'queue',
  isBottumReviewerOnly: true,
  usage: [
    {
      optional: true,
      type: 'number',
      default: 0
    }
  ],
  async execute(client, message, args) {
    let [page] = args;

    // the queue system
    // BOT NAME (PREFIX) - INVITE (NO PERMS) - INVITE (8 PERMS)
    // if its apprvoed dont show it on the list

    const bots = await Database.getUnapprovedBots(page);
    const pageCount = Math.ceil((await Database.getUnapprovedCount()) / 20);

    const embed = new MessageEmbed()
      .setTitle('***Queue***')
      .setDescription(
        bots
          .map((bot) => {
            const invite = `https://discord.com/oauth2/authorize?client_id=${bot.id}&scope=bot%20applications.commands&perms=`;
            return `${bot.name} (${bot.prefix}) - ${hyperlink(
              'invite (no perms)',
              `${invite}0`
            )} - ${hyperlink('invite (administrator perms)', `${invite}8`)}`;
          })
          .join('\n\n')
      )
      .setFooter(`Page ${page} / ${pageCount} - !queue [page=0]`);

    await message.channel.send({ embeds: [embed] });

    // why not
    Core.Logger.logStat(`:scroll: !queue viewed`);
  }
};
// VXComplexity (/) - [invite (no perms)](https://discord.com/oauth2/authorize?client_id=[object Object]&scope=bot%20applications.commands&perms=0) - [invite (administrator perms)](https://discord.com/oauth2/authorize?client_id=[object Object]&scope=bot%20applications.commands&perms=8)

// why ? (look discord https://canary.discord.com/channels/966004820471337060/966054604435505235/986943852122357830
