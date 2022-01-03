const Discord = require('discord.js')
const Index = require('../index')

module.exports = {
    name: "purge",
    async execute(message, args, handler){
        if(await  handler.getPermissionLevel(message.member) < 4){
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

        if(args.length == 1){
            if(isNaN(args[0])) {
                const embed = new Discord.MessageEmbed()
                .setTitle('Amount of messages is not a number :warning:')
                .setColor("#ed0909")
                .setDescription(`Please provide a valid number as argument.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }
            const amount = parseInt(args[0]) +1;

            message.channel.bulkDelete(amount).then(()=>{

                const temp = amount-1 < 2 ? "1 message was deleted." : `${amount-1} messagges were deleted.`
                const embed = new Discord.MessageEmbed()
                .setTitle('Messages purged :white_check_mark:')
                .setColor("#56d402")
                .setDescription(temp)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).then((msg) =>{
                    setTimeout(() =>{msg.delete().catch(err => {})}, 3000)
                })
            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}purge <Amount>`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}