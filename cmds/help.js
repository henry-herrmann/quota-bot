const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "help",
    async execute(message, args, handler){
        let perm = await handler.getPermissionLevel(message.member);

        const prefix = await handler.getPrefix();
        const supportsPatrols = handler.supportsPatrols();
        const announceMembers = parseInt((await handler.getConfig("Announce-Members")).Value);

        if(args.length == 0){
            if(perm >= 4){
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Level 4+ Commands (HiCom)`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for all personnel with permission level 4 or higher: `)
                .addField(`**Points**`, `>>> **${prefix}points** __<add,remove> <attend, host${supportsPatrols ? ", patrol" : ""}> <amount> <@User>__ - Adds/removes points to the user(s)\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                .addField(`**Quota**`, `>>> **${prefix}members** - Displays all members in the database\n**${prefix}quotafailures** - Displays all quotafailures for the week.\n**${prefix}resetpoints** - Resets the database.\n**${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}totalevents** __<activity, hosts, ${supportsPatrols ? ", patrols" : ""}>__ - Generates a bar chart.`)
                .addField(`**Filtering**`, `>>> **${prefix}filter** __<@User>__ - Filters a user in.${announceMembers == 1 ? `\n**${prefix}announce** - Announces filtered members in on-duty.` : ""}`)
                .addField(`**Moderation**`, `>>> **${prefix}kick** __@User (<Reason>)__ - Kicks them, removes them from the database and, if enabled, from the group.\n**${prefix}ban** __<@User> (<Reason>)__ - Bans them, removes them from the database and, if enabled, from the group.\n**${prefix}discharge** __<@User>__ - Removes the user from the database and, if enabled, from the group.\n**${prefix}notice** __<@User or @Role or nothing> <Message>__ - Sends a DM to the mentioned user(s)/role(s)\n**${prefix}purge** __<Amount>__ - Deletes a specified amount of messages.\n**${prefix}inactivity** __<add,remove> <(Length for add only)> <@User>__ - Adds/removes INs.\n**${prefix}inactivity** __<list>__ - Displays all INs.`)
                .addField(`**Misc**`, `>>> **${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}alderaan** - Displays stats of Alderaan.\n**${prefix}coin** - Flips a coin.`)
                .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }else if(perm >= 1){
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Level 1+ Commands (Staff)`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for all personnel with permission level 1 or higher: `)
                .addField(`**Points**`, `>>> **${prefix}points** - Displays your points.\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                .addField(`**Quota**`, `>>> **${prefix}top** - Displays the top 5 leaderboard.`)
                .addField(`**Misc**`, `>>> **${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}alderaan** - Displays stats of Alderaan.\n**${prefix}coin** - Flips a coin.`)
                .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }else{
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Commands`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for standard division members: `)
                .addField(`**Points**`, `>>> **${prefix}points** - Displays your points.`)
                .addField(`**Quota**`, `>>> **${prefix}top** - Displays the top 5 leaderboard.`)
                .addField(`**Misc**`, `>>> **${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}sg**\n**${prefix}alderaan** - Displays stats of Alderaan.\n**${prefix}coin** - Flips a coin.`)
                .setFooter({text: "Contact PriorAdjudicator#4723 in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }
        }
    }
}