import { ParseArgs, UsagesToString } from '../UsageSystem.js';

export default {
  name: 'messageCreate',
  async execute(client, message) {
    if (
      client.botOptions.addBotDelMessages &&
      message.channel.id === client.botOptions.add_bot &&
      !message.content.startsWith('!add-bot')
    )
      await message.delete().catch(() => undefined);

    if (
      message.author.bot ||
      message.channel.type === 'DM' ||
      !message.content.toLowerCase().startsWith(client.botOptions.prefix)
    )
      return;

    const args = message.content
      .slice(client.botOptions.prefix.length)
      .split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (command === undefined) return;

    if (
      command.isTeamOnly &&
      !client.botOptions.team.includes(message.author.id)
    ) {
      await message.reply('mfw youre not in the team');
      return;
    }

    if (
      command.canOnlyExecutedByAshley &&
      !client.botOptions.ashley.includes(message.author.id)
    ) {
      await message.reply('id please');
      return;
    }

    if (
      command.isBottumReviewerOnly &&
      !message.member.roles.cache.has(client.botOptions.bottumrev)
    ) {
      await message.reply('You have to be a bottum reviewer bruh');
      return;
    }

    if (
      command.isAddBotChannelOnly &&
      message.channel.id !== client.botOptions.add_bot
    ) {
      await message.reply(
        'my reaction to that command: <#966397896176058428>' // modified funny message by dennis //LMAO
      );
      return;
    }

    if (!Array.isArray(command.usage)) command.usage = [];
    try {
      let { fail, fails, args: newargs } = await ParseArgs(command.usage, args);

      if (fails.length) {
        await message.reply(
          `**Usage:** \`${client.botOptions.prefix}${
            command.name
          } ${UsagesToString(command.usage)}\`\n` +
            fails.map((x) => ':x: ' + x).join('\n')
        );
        return;
      }

      console.log(newargs);
      await command.execute(client, message, newargs);
    } catch (error) {
      console.log(error);
      await message.channel.send(
        `An error occured ...\n\`\`\`xl\n${error.toString()}\n${
          error.stack
        }\`\`\``
      );
    }
  }
};
