import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

/**
 * Load all the commands and events.
 * @param {Client} client
 * @param {string} dir
 */
const loadCommands = async (client, dir) => {
  if (!dir) dir = resolve(join(client.frameworkDirectory, 'commands'));

  const files = readdirSync(dir).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const { default: command } = await import(pathToFileURL(join(dir, file)));

    client.commands.set(command.name, command);

    console.log(`The command ${command.name} is loaded :3`);
  }
};

/**
 * Load all the events
 * @param {Client} client
 * @param {string} dir
 */
const loadEvents = async (client, dir) => {
  if (!dir) dir = resolve(join(client.frameworkDirectory, 'events'));

  const files = readdirSync(dir).filter((f) => f.endsWith('.js'));

  for (const file of files) {
    const { default: event } = await import(pathToFileURL(join(dir, file)));

    client[event.once ? 'once' : 'on'](
      event.name,
      event.execute.bind(null, client)
    );

    console.log(`The event ${event.name} is loaded :>`);
  }
};

export { loadCommands, loadEvents };
