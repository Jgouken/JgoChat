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
        if (message.content.toLocaleLowerCase() == 'hey jgochat') return message.channel.send(`Hello there, ${message.author.username}! Ask me for the help command by asking "Hey JgoChat, help!"`)
        if (!message.content.toLocaleLowerCase().startsWith(config.prefix.toLocaleLowerCase())) return;
        if (!(message.guild.me).hasPermission("SEND_MESSAGES")) return;
        const input = message.content.slice(config.prefix.length).trim()
        if (!input.length) return;
        const [, command, commandArgs] = input.match(/(\w+)\s*([\s\S]*)/);
        if (command.toLocaleLowerCase().replace(/[^a-z0-9 _ -]/gi, '') == 'help' || command.toLocaleLowerCase().replace(/[^a-z0-9 _ -]/gi, '') == 'helpme') {
          const embed = new Discord.MessageEmbed()
          .setTitle('Help')
          .setDescription(`Start every command with "${config.prefix}"\n\n**()** = Optional, **<>** = Required, **[ | ]** = Required Choice, **{...}** = User argument.`)
          .setFooter(`This help commmand is automatically generated.`, message.author.avatarURL())
          bot.commands.forEach(command => {
            embed.addField(`__${command.name.toLocaleUpperCase()}__`, command.description, true)
          });
          message.channel.send(embed)
          // Once we have enough commands, we'll add in the page system later.
          return;
        }
        const called = bot.commands.get(command)
        if (called) called.execute(message, commandArgs, config, bot)
    })
})

// Reset Channel, Add some more customization options to create channel, figure out how to do by name when deleting a channel, move members, report a message, user, or bug, 

bot.login(config.TOKEN)