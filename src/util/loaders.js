const { readdirSync } = require('fs');

/**
 * Load all the commands
 * @param {Client} client
 * @param {String} dir
 */
const loadCommands = (
  client,
  dir = require('path').join(__dirname, '../commands')
) => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const command = require(`${dir}/${file}`);
    client.commands.set(command.name, command);
    console.log(`The command ${command.name} is loaded :3`);
  }
};


/**
 * Load all the events
 * @param {Client} client
 * @param {String} dir
 */
const loadEvents = (
  client,
  dir = require('path').join(__dirname, '../events')
) => {
  const files = readdirSync(dir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    const event = require(`${dir}/${file}`);
    const eventName = file.split('.')[0];

    if (event.once) client.once(eventName, event.execute.bind(null, client));
    else client.on(eventName, event.execute.bind(null, client));
    console.log(`The event ${eventName} is loaded :>`);
  }
};

module.exports = { loadCommands, loadEvents };
