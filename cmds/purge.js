const Discord = require('discord.js')
const Index = require('../index')

module.exports = {
    name: "purge",
    /**
     * 
     * @param {Message} message 
     * @param {Array} args 
     * @param {DivisionDB} handler 
     * @returns {undefined}
     */
    async execute(message, args, handler){
        //Checks if the guild member does not have a role with at least permission level 4.
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

        //Gets the prefix for the guild.
        const prefix = await handler.getPrefix();

        if(args.length == 1){
            //Checks if the first argument is not a number.
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
            const amount = parseInt(args[0]) +1; //Calculates the amount of messages to delete, plus one message sent when calling the command.

            //Deletes the specified amount of messages.
            message.channel.bulkDelete(amount).then(()=>{

                const temp = amount-1 < 2 ? "1 message was deleted." : `${amount-1} messagges were deleted.` //Decides whether to use the word "message" or "messages" depending on the number of messages that were deleted.

                const embed = new Discord.MessageEmbed()
                .setTitle('Messages purged :white_check_mark:')
                .setColor("#56d402")
                .setDescription(temp)
                .setFooter(Index.footer)
                .setTimestamp();

                //Sends the confirmation embed
                message.channel.send({embeds: [embed]}).then((msg) =>{
                    setTimeout(() =>{msg.delete().catch(err => {})}, 3000) //Deletes the confirmation embed after 3 seconds.
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