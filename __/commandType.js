// if its a string, it will resolve the already registered Usage from client.usages
// error messages will be designed so you wont have to type them (thats good imo)
const Usage = {
  // The error message if its wrong
  message: "1984", // this is just a design plan
  
  // The error message when optional is false and the argument isnt given
  messageRequired: "",
  
  // Types:
  // text (default)
  // number
  // user
  type: "",
  
  // Max length of text
  max: 21,
  
  // false by default
  optional: false,
  
  // only applicable for user
  bot: true,
  
  // if true, treat the rest of the args as a single arg
  rest: false,
}


const Command = {
  // command name
  name: 'add-bot',
  
  // description info
  description: {
    
  },
  
  // if present, will only accept the command on channels with the ids
  channels: ["123"],
  
   // then no
  
  // custom argument system
  usage: [], // an array of string or object, see Usage
  
  // async function to execute
  async execute(client, message, args) {
    
  }
};

module.exports = Command;