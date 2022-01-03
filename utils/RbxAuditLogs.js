const Discord = require('discord.js')
const Index = require("../index");

async function onAuditLog(data, client, handler){
    const color = (await handler.getConfig("Divisional-Color")).Value;

    if(data.actionType == "Change Rank"){
        const targetname = data.description.TargetName;
        const oldrank = data.description.OldRoleSetName;
        const newrank = data.description.NewRoleSetName;

        const authorname = data.actor.user.username;
        const authorrank = data.actor.role.name; 

        const embed = new Discord.MessageEmbed()
        .setTitle("Rank Change")
        .setDescription(`**${authorname}** (${authorrank}) changed **${targetname}'s** rank from __${oldrank}__ to __${newrank}__.`)
        .setColor(color)
        .setFooter(Index.footer)
        .setTimestamp();

        client.channels.cache.get(await handler.getChannel("rbx-audit-logs")).send({embeds: [embed]})
    }
    if(data.actionType == "Accept Join Request"){
        const authorname = data.actor.user.username;
        const authorrank = data.actor.role.name; 
        const targetname = data.description.TargetName;

        const embed = new Discord.MessageEmbed()
        .setTitle("Accepted Join Request")
        .setDescription(`**${authorname}** (${authorrank}) accepted **${targetname}'s** join request.`)
        .setColor("#00e016")
        .setFooter(Index.footer)
        .setTimestamp();

        client.channels.cache.get(await handler.getChannel("rbx-audit-logs")).send({embeds: [embed]})
    }
    
    if(data.actionType == "Remove Member"){
        const authorname = data.actor.user.username;
        const authorrank = data.actor.role.name; 
        const targetname = data.description.TargetName;

        const embed = new Discord.MessageEmbed()
        .setTitle("User exiled")
        .setDescription(`**${authorname}** (${authorrank}) kicked **${targetname}** out of the group.`)
        .setFooter(Index.footer)
        .setTimestamp();

        client.channels.cache.get(await handler.getChannel("rbx-audit-logs")).send({embeds: [embed]})
    }
}

module.exports.onAuditLog = onAuditLog;