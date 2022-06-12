const { Discord } = require('discord.js');

const createAPIMessage = async (interaction, content, client) => {
  const { data, files } = await Discord.APIMessage.create(
    client.channels.resolve(interaction.channel_id),
    content
  )
    .resolveData()
    .resolveFiles();
  return { ...data, files };
};

const sendAPIMessage = async (interaction, response, client) => {
  let data = {
    content: response
  };

  if (typeof response === 'object') {
    data = await createAPIMessage(interaction, response);
  }

  client.api.interactions(interaction.id, interaction.token).callback.post({
    data: {
      type: 4,
      data
    }
  });
};

module.exports.functions = { createAPIMessage, sendAPIMessage };

module.exports = {
  once: false,
  canOnlyExecutedOnWebSocket: true,
  execute(interaction) {
    var command = '';
    if (interaction.data.name) command = interaction.data.name.toLowerCase();

    if (command === 'motd') {
      require('./commands/slash/motd');
    }
  }
};
