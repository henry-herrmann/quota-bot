const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "reload",
    async execute(message, args, handler, client){
        if(message.author.id != "282590125408387073"){
            return;
        }

        if(args.length == 1){
            let cmdName = args[0].toLowerCase();

            try{
                delete require.cache[require.resolve(`./${cmdName}.js`)];
                client.commands.delete(cmdName);
                const pull = require(`./${cmdName}.js`);
                client.commands.set(cmdName, pull);
      
                var embed = new Discord.MessageEmbed()
                .setTitle(`Command reloaded :white_check_mark: `)
                .setColor("#56d402")
                .setDescription(`Name: **${cmdName}**`)
                .setFooter(Index.footer)
                .setTimestamp();
      
                return message.channel.send({embeds: [embed]});
              }catch(e){
                console.log(e);
                var embed = new Discord.MessageEmbed()
                .setTitle(`Error :warning:`)
                .setColor("#ed0909")
                .setDescription(`Could not reload the command: **${cmdName}**`)
                .setFooter(Index.footer)
                .setTimestamp();
      
                return message.channel.send({embeds: [embed]});
              }
        }else{
            const prefix = await handler.getPrefix();
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}reload`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;
        }
    }
}