import { MessageEmbed, Formatters } from 'discord.js';
import { Type } from '@sapphire/type';
import { inspect } from 'node:util';

const { codeBlock } = Formatters;

const _8203 = String.fromCharCode(8203);

export default {
  name: 'eval',
  canOnlyExecutedByAshley: true,
  usage: [
    {
      name: 'code',
      rest: true
    }
  ],
  async execute(client, message, args) {
    const [code] = args;

    let output,
      type_ = null,
      time = performance.now();

    try {
      output = await eval(code);
      time = performance.now() - time;

      type_ = new Type(output).toString();

      if (typeof output !== 'string') output = inspect(output);

      output = output.replace(/(`|@)/g, `${_8203}$1`);
    } catch (err) {
      type_ = new Type(err).toString();
      output = inspect(err);
      time = performance.now() - time;
    }

    output = output.replaceAll(
      client.token,
      'aHR0cHM6Ly9wb2tldHViZS5mdW4vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ=='
    );

    const embed = new MessageEmbed()
      .setColor('GREEN')
      .setTitle('Evaluation Output')
      .setDescription(
        codeBlock('js', output.length > 4060 ? output.slice(0, 4060) : output)
      )
      .addField('Type', codeBlock('ts', type_))
      .addField('Took', codeBlock('js', `${time} ms`));

    await message.reply({ embeds: [embed] });
  }
};
