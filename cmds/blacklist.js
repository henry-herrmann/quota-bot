const Discord = require("discord.js");

module.exports = {
    name: "blacklist",
    async execute(message, args, client, handler){
        if(await handler.getPermissionLevel(message.member) < 4){
            const embed = new Discord.MessageEmbed()
            .setTitle('Insufficient permissions :warning:')
            .setColor("#ed0909")
            .setDescription(`You are missing the required permissions to execute this command.`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})

            return;
        }

        if(args.length > 0){
            if(args[0].toLowerCase() == "add"){
                if(args[1] == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Please specify a user to blacklist :warning:')
                    .setColor("#ed0909")
                    .setDescription(`State the name of the user.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                    message.channel.send({embeds: [embed]})

                    return;
                }

                const reason = args.splice(2).join(" ");

                if(args[2] == undefined && reason == undefined){
                    try {
                        handler.addBlacklist(args[1], "Permanent", "Blacklisted.");

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User blacklisted :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Name: ${args[1]}\nDuration: Permanent\nReason: None.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                    } catch (error) {
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Database error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Please contact Henryhre.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
    
                        return;
                    }
                }else if(args[2] != undefined && reason == undefined){
                    try {
                        handler.addBlacklist(args[1], args[2], "Blacklisted.");

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User blacklisted :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Name: ${args[1]}\nDuration: ${args[2]}\nReason: None.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                    } catch (error) {
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Database error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Please contact Henryhre.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
    
                        return;
                    }
                }else{
                    try {
                        handler.addBlacklist(args[1], args[2], reason);

                        const embed = new Discord.MessageEmbed()
                        .setTitle('User blacklisted :white_check_mark:')
                        .setColor("#56d402")
                        .setDescription(`Name: ${args[1]}\nDuration: ${args[2]}\nReason: ${reason}`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
                    } catch (error) {
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Database error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Please contact Henryhre.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                        message.channel.send({embeds: [embed]})
    
                        return;
                    }
                }
            }
        }
    }
}