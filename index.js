const config = require('./config/config')
const {bot, Discord} = require('./config/config')
const fs = require('fs');
bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

bot.on('ready', async () => {
    setTimeout(() => {
      bot.user.setPresence({
        status: 'online',
        activity: {
          name: `${bot.guilds.cache.size} servers! | ${config.prefix}help`,
          type: 'WATCHING',
        }
      })
    }, 30 * 1000)
  
    console.log('\n\nBOT IS RUNNING!\n\n');
  
    bot.on('message', async message => {
        if (message.author.bot) return;
        if (message.channel.type == 'dm') return;
        if (message.content.toLocaleLowerCase() == 'hey jgochat') return message.channel.send(`Hello there, ${message.author.username}! Ask me for the help command by asking "Hey JgoChat, help me!"`)
        if (!message.content.toLocaleLowerCase().startsWith(config.prefix.toLocaleLowerCase())) return;
        if (!(message.guild.me).hasPermission("SEND_MESSAGES")) return;
        const input = message.content.slice(config.prefix.length).trim()
        if (!input.length) return;
        const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
        const called = bot.commands.get(command)
        if (called) called.execute(message, commandArgs, config, bot)
    })
})

bot.login(config.TOKEN)