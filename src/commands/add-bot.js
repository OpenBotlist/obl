
export default {
  name: 'add-bot',
  isAddBotChannelOnly: true,
  usage: ['botId', 'prefix', 'shortDesc'],
  async execute(client, message, args) { 
    const [bot, prefix, shortDesc] = args
    // ReferenceError: id is not defined
    console.log("add bot args", args);
     
    const bots = client.db.collection('bots');
    if (!args[0] || !args[1] || !args[2] || bot.user.bot) {
      await message.reply({ content: "dub tbh" })
      
      return;
    }
    const entry = await bots.findOne({ id: bot.id });

    if (entry?.approved) {
      await message.reply({ content: 'That bot is already approved.' });

      return;
    }

    if (entry !== null) {
      await message.reply({ content: 'That bot already exists in the queue.' });

      return;
    }

    await bots.insertOne({
      name: bot.username,
      avatarURL: bot.displayAvatarURL({ format: 'png' }),
      id,
      prefix,
      shortDesc,
      approved: false,
      ownerID: message.author.id
    });

    await message.author
      .send('Your bot has been added to the queue!')
      .catch(() => undefined); // send it to DMs
    await message.delete().catch(() => undefined); // this should delete the command message (!add-bot)
  }
};
