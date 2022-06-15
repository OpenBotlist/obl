export default {
  name: 'ready',
  once: true,
  async execute(client) {
    

    console.log(`${client.user.tag} is online`);
  }
};
