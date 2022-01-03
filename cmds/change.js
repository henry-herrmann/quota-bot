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
        const prefix = await handler.getPrefix();

        const validargs = [
            {
                name: "prefix",
                require: "string",
                reply: "Successfully set the prefix to: "
            }
        ]

        if(args.length == 1){
            if(args[0] == undefined || args[0] == null){
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}change <option>`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }
            
            if(!validargs.map(e => e.name).includes(args[0])){
                const embed = new Discord.MessageEmbed()
                .setTitle('Invalid option :warning:')
                .setColor("#ed0909")
                .setDescription(`Options: `)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }

            const option = validargs.find(e => e.name == args[0]);

            console.log(option)
        }
    }
}