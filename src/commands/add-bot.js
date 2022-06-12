module.exports = {
  name: 'add-bot',
  isAddBotChannelOnly: true,
  usage: [
    "botId",
    "prefix",
    "shortDesc",
  ], // all done
  async execute(client, message, args) {
    const [bot, prefix, shortDesc] = args;

    client.db.set(id, { // we need to set it like bots ? (see db.json)
      name: bot.username,
      avatarURL: bot.avatarURL(), // it was a method right? i havent been on js for long... this is djs v13 btw and yes its method
      id,                         // lol
      prefix,
      shortDesc,
      approved: false,
      owner: message.author.id
    });

    await message.author.send('Your bot has been added to the queue!'); //send it to PMs
    await message.delete(); // this should delete the command message (!add-bot)
  }
};
