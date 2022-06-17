import { Formatters } from 'discord.js';
import Core from '../core.js';

import CustomUsages from './CustomUsages.js';

const { inlineCode, bold, italic } = Formatters;

const debug = true;

// Usage System v 2 . 0 !!!
// made by dennis TM while drunk

const NativeUsages = {
  text: {
    type: 'native',
    async parse(arg, opts) {
      if (opts.max !== undefined && arg.length > opts.max) {
        return {
          fail: true,
          message: `${inlineCode(opts.name)} cannot be longer than ${inlineCode(
            opts.max
          )} characters!`
        };
      }

      if (opts.min !== undefined && arg.length <= opts.min) {
        return {
          fail: true,
          message: `${inlineCode(
            opts.name
          )} cannot be shorter than ${inlineCode(opts.min)} characters!`
        };
      }

      return { parsed: arg };
    }
  },
  number: {
    type: 'native',
    async parse(arg, opts) {
      arg = Number(arg);

      if (isNaN(arg)) {
        return {
          fail: true,
          message: `${inlineCode(opts.name)} must be a number!`
        };
      }

      if (opts.max !== undefined && arg > opts.max) {
        return {
          fail: true,
          message: `${inlineCode(opts.name)} cannot be larger than ${inlineCode(
            opts.max
          )}!`
        };
      }

      return { parsed: arg };
    }
  },
  user: {
    type: 'native',
    async parse(arg, opts) {
      const user = await Core.Client.users.fetch(arg).catch(() => null);

      if (user === null)
        return {
          fail: true,
          message: `${inlineCode(opts.name)}: ${
            opts.bot ? 'Bot' : 'User'
          } not found!`
        };

      if (opts.bot && !user.bot)
        return {
          fail: true,
          message: `${inlineCode(opts.name)}: ${bold(
            user.username
          )} isnt a bot!`
        };
      else if (!opts.bot && user.bot)
        return {
          fail: true,
          message: `${inlineCode(opts.name)}: ${bold(user.username)} is a bot!`
        };

      return { parsed: user };
    }
  },
  member: {
    type: 'user',
    async parse(user, opts) {
      const member = await Core.MasterGuild.members
        .fetch(user.id)
        .catch(() => null);

      if (member === null)
        return {
          fail: true,
          message: `${inlineCode(opts.name)}: ${bold(
            user.username
          )} isn't on ${italic(Core.MasterGuild.name)}!`
        };

      return { parsed: member };
    }
  }
};

function ResolveUsage(usage) {
  if (debug) console.log('resolveUsage before', usage);
  if (typeof usage === 'string') {
    const name = usage;
    usage = NativeUsages[usage] || CustomUsages[usage] || NativeUsages.text;

    if (usage != undefined && usage.name == undefined) usage.name = name;
  }

  usage.type = usage.type || 'text';
  if (debug) console.log('resolveUsage after', usage);
  return usage;
}

async function ParseArg(usage, rawarg) {
  usage = ResolveUsage(usage);

  const fnTree = [];

  // Recurse through types
  // This does 2 things:
  // Collect parser functions and populate master usage object (for parser's second argument opts)
  let recurseUsage = usage;
  do {
    if (debug)
      console.log('parseArg recurse obj:', recurseUsage, 'master:', usage);
    if (recurseUsage.parse) fnTree.push(usage.parse);
    for (const key in recurseUsage)
      if (recurseUsage !== usage && usage[key] === undefined)
        usage[key] = recurseUsage[key];

    recurseUsage = ResolveUsage(recurseUsage.type);
  } while (
    recurseUsage &&
    recurseUsage.type !== undefined &&
    recurseUsage.type !== 'native'
  );

  fnTree.reverse();

  if (!rawarg) {
    if (usage.optional) {
      return {
        parsed: usage.default ?? null
      };
    } else {
      return {
        fail: true,
        message: `${inlineCode(usage.name)} is required!`
      };
    }
  }

  // Run argument through the parser functions
  // Example: string -> discord user object -> mongodb bot object
  let arg = rawarg,
    _di = 0;
  for (let fn of fnTree) {
    if (debug) console.log('parseArg fnTree', fnTree);
    if (debug) console.log('parseArg fnTree before', _di, 'arg:', arg);
    let parseOutput = await fn.parse(arg, usage);
    if (debug) console.log('parseArg fnTree after', arg);
    _di++;

    if (parseOutput.fail) {
      return parseOutput;
    }
    arg = parseOutput.parsed;
  }
  if (debug) console.log('parseArg fnTree final done returning', arg);
  return { parsed: arg };
}

async function ParseArgs(usages, rawargs) {
  if (debug) console.log('parseArgs call arguments', usages, rawargs);
  // name safe
  usages = usages.map((usage, i) => {
    if (typeof usage !== 'string') {
      if (!usage.name) usage.name = `arg${i + 1}`;
    }
    return usage;
  });
  if (debug) console.log('parseArgs after name safe', usages);

  let args = [];
  let fails = [];

  let _i = 0;
  for (let usage of usages) {
    let rawarg = rawargs[_i];
    _i++;
    // custom for rest
    if (typeof usage !== 'string' && usage.rest) {
      args.push(args.slice(_i).join(' '));
      if (!usage.optional && !rawarg) {
        fails.push(`${inlineCode(usage.name)} is required!`);
      }
      break;
    }

    if (debug)
      console.log('parseArgs calling parseArg', _i, usages[_i], rawarg);
    let parseOutput = await ParseArg(usage, rawarg);

    if (parseOutput.fail) {
      fails.push(parseOutput.message);
      continue;
    }
    args.push(parseOutput.parsed);
  }

  if (debug) console.log('parseArgs end', fails, args);

  return {
    fail: fails.length > 0,
    fails,
    args
  };
}

function UsageToString(usage) {
  usage = ResolveUsage(usage);

  let braceOpen = usage.optional ? '[' : '<';
  let braceClose = usage.optional ? ']' : '>';

  let utype = '';
  let recurseUsage = usage;
  do {
    if (recurseUsage.typeName !== undefined) {
      utype = ': ' + recurseUsage.typeName;
      break;
    }
    recurseUsage = ResolveUsage(recurseUsage.type);
  } while (
    recurseUsage &&
    recurseUsage.type !== undefined &&
    recurseUsage.type !== 'native'
  );

  return braceOpen + usage.name + utype + braceClose;
}

function UsagesToString(usages) {
  // name safe
  usages = usages.map((usage, i) => {
    if (typeof usage !== 'string') {
      if (!usage.name) usage.name = `arg${i + 1}`;
    }
    return usage;
  });

  return usages.map((u) => UsageToString(u)).join(' ');
}

export { ParseArgs, ParseArg, UsagesToString, UsageToString };
