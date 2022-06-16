import Core from '../core.js';

const CustomUsages = {
  savedBot: {
    type: "user",
    bot: true,
    
    async parse(user, opts) {
      let botData = Core.Database.getBotById(user.id);
      
      if (!botData) {
        return {
          fail: true,
          message: `**${user.username}** isn't a registered bot!`,
        };
      };
      
      if (opts.approved !== undefined) {
        if (opts.approved !== botData.approved) return {
          fail: true,
          message: `**${user.username}** is not an ${opts.approved ? "approved" : "unapproved"} bot!`,
        };
      };
      
      return {
        parsed: botData,
      };
    },
  },
  
  unregisteredBot: {
    type: "user",
    bot: true,
    
    async parse(user, opts) {
      let botData = Core.Database.getBotById(user.id);
      
      if (botData) {
        return {
          fail: true,
          message: `**${user.username}** is already registered!`,
        };
      };
      
      return {
        parsed: user,
      };
    },
  },
  
  approvedBot: {
    type: "savedBot",
    approved: true,
  },
  
  unapprovedBot: {
    type: "savedBot",
    approved: false,
  },
};

export default CustomUsages;