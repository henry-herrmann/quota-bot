const Discord = require("discord.js");
const { Util } = require("discord.js");
const Index = require("../index");
const dateFormat = require("dateformat");
const PageEmbed = require('../utils/PageEmbed');
const PageEmbedHandler = require('../utils/PageEmbedHandler');

module.exports = {
    name: "members",
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

        if(await handler.isConfigured() == false){
            const embed = new Discord.MessageEmbed()
            .setTitle('Division already configured :warning:')
            .setColor("#ed0909")
            .setDescription(`The setup process has yet to be executed. Please use the **${prefix}setup** command.`)
            .setFooter(Index.footer)
            .setTimestamp();
                  
            message.channel.send({embeds: [embed]})
            return;
        }

        if(args.length == 0){
            const members = await handler.getMembers();
            const color = (await handler.getConfig("Divisional-Color")).Value;

            let arr = [];

            const supportsPatrols = handler.supportsPatrols();

            for(const member of members){
                const datestring = new Date(member.Joined).toLocaleString('en-US', {timeZone: 'America/New_York'});
                var date = dateFormat(datestring, "m/d/yy");
                arr.push(`- <@${member.Id}>(${member.RbxId}): A: ${member.Attend}${supportsPatrols ? `, P: ${member.Patrol}` : ""}, H: ${member.Host}, Join: ${date}, Staff: ${member.Staff}`);
            }
            const msg = arr.join("\n");

            const string = Util.splitMessage(msg, { maxLength: 4096 });

            const membersEmbed = new PageEmbed(`Members (${members.length})`, color, string);
            const membersSent = await message.channel.send({embeds: [membersEmbed.getCurrentPageEmbed()]});
            
            if(membersEmbed.getLength()-1 > 0 ){
                membersSent.react("➡️");
            }
            
            PageEmbedHandler.addEmbed(membersEmbed, membersSent.id);
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}members`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}
