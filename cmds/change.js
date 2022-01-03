const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "change",
    async execute(message, args, handler, client){
        if(await handler.getPermissionLevel(message.member) < 5){
            const embed = new Discord.MessageEmbed()
              .setTitle('Insufficient permissions :warning:')
              .setColor("#ed0909")
              .setDescription(`You are missing the required permissions to execute this command.`)
              .setFooter(Index.footer)
              .setTimestamp();

              message.channel.send({embeds: [embed]})
              return;
        }
    }
}