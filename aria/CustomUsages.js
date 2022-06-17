import { Formatters } from 'discord.js';
import Core from '../core.js';

const { bold } = Formatters;

const CustomUsages = {
  savedBot: {
    type: 'user',
    bot: true,
    async parse(user, opts) {
      const botData = Core.Database.getBotById(user.id);

      if (botData == undefined)
        return {
          fail: true,
          message: `${bold(user.username)} isn't a registered bot!`
        };

      if (opts.approved !== undefined && opts.approved !== botData.approved)
        return {
          fail: true,
          message: `${bold(user.username)} is not an ${
            opts.approved ? 'approved' : 'unapproved'
          } bot!`
        };

      return { parsed: botData };
    }
  },
  unregisteredBot: {
    type: 'user',
    bot: true,
    async parse(user) {
      const botData = Core.Database.getBotById(user.id);

      if (botData != undefined)
        return {
          fail: true,
          message: `${bold(user.username)} is already registered!`
        };

      return { parsed: user };
    }
  },
  approvedBot: {
    type: 'savedBot',
    approved: true
  },
  unapprovedBot: {
    type: 'savedBot',
    approved: false
  }
};

export default CustomUsages;
