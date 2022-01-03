const Discord = require("discord.js");
const { Util } = require("discord.js");
const Index = require("../index");
const dateFormat = require("dateformat");

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

        if(args.length == 0){
            const members = await handler.getMembers();

            let arr = [];

            const supportsPatrols = handler.supportsPatrols();

            for(const member of members){
                const datestring = new Date(member.Joined).toLocaleString('en-US', {timeZone: 'America/New_York'});
                var date = dateFormat(datestring, "m/d/yy");
                arr.push(`- <@${member.Id}>(${member.RbxId}): A: ${member.Attend}${supportsPatrols ? `, P: ${member.Patrol}` : ""}, H: ${member.Host}, Join: ${date}, Staff: ${member.Staff}`);
            }
            const msg = arr.join("\n");
            const string = await Util.splitMessage(msg, { maxLength: 2000 });
            message.channel.send("Members: \n" + string);
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
