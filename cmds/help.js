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
            if(perm == 5){
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Level 5 Commands (HiCom)`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for all personnel with permission level 4 or higher: `)
                .addField(`**Points**`, `>>> **${prefix}points** __<add,remove> <attend, host${supportsPatrols ? ", patrol" : ""}> <amount> <@User>__ - Adds/removes points to the user(s)\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                .addField(`**Quota**`, `>>> **${prefix}members** - Displays all members in the database\n**${prefix}quotafailures** - Displays all quotafailures for the week.\n**${prefix}quotapasses** - Displays a list of members who passed the week's quota.\n**${prefix}resetpoints** - Resets the database.\n**${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}totalevents** __<activity, hosts, ${supportsPatrols ? ", patrols" : ""}>__ - Generates a bar chart.\n**${prefix}quota** <set, remove, list> (<@Role or roleid>) - Sets the quota for individual roles.\n**${prefix}events** <set, unset> <attend,host> (<Amount of Points (Only necessary for set)>) <Event name> - Changes the points values for events.`)
                .addField(`**Filtering**`, `>>> **${prefix}filter** __<@User>__ - Filters a user in.${announceMembers == 1 ? `\n**${prefix}announce** - Announces filtered members in on-duty.` : ""}`)
                .addField(`**Moderation**`, `>>> **${prefix}kick** __@User (<Reason>)__ - Kicks them, removes them from the database and, if enabled, from the group.\n**${prefix}ban** __<@User> (<Reason>)__ - Bans them, removes them from the database and, if enabled, from the group.\n**${prefix}discharge** __<@User>__ - Removes the user from the database and, if enabled, from the group.\n**${prefix}notice** __<@User or @Role or nothing> <Message>__ - Sends a DM to the mentioned user(s)/role(s)\n**${prefix}purge** __<Amount>__ - Deletes a specified amount of messages.\n**${prefix}inactivity** __<add,remove> <(Length for add only)> <@User>__ - Adds/removes INs.\n**${prefix}inactivity** __<list>__ - Displays all INs.`)
                .addField(`**Misc**`, `>>> **${prefix}change** __<Parameter>__\n**${prefix}setup**\n**${prefix}update** (<@User>)\n**${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}game** __<1313, alderaan>__ - Displays stats of either 1313 or Alderaan.\n**${prefix}division** <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }else if(perm == 4){
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Level 4 Commands (HiCom)`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for all personnel with permission level 4 or higher: `)
                .addField(`**Points**`, `>>> **${prefix}points** __<add,remove> <attend, host${supportsPatrols ? ", patrol" : ""}> <amount> <@User>__ - Adds/removes points to the user(s)\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                .addField(`**Quota**`, `>>> **${prefix}members** - Displays all members in the database\n**${prefix}quotafailures** - Displays all quotafailures for the week.\n**${prefix}quotapasses** - Displays a list of members who passed the week's quota.\n**${prefix}resetpoints** - Resets the database.\n**${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}totalevents** __<activity, hosts, ${supportsPatrols ? ", patrols" : ""}>__ - Generates a bar chart.\n**${prefix}quota** <set, remove, list> (<@Role or roleid>) - Sets the quota for individual roles.\n**${prefix}events** <set, unset> <attend,host> (<Amount of Points (Only necessary for set)>) <Event name> - Changes the points values for events.`)
                .addField(`**Filtering**`, `>>> **${prefix}filter** __<@User>__ - Filters a user in.${announceMembers == 1 ? `\n**${prefix}announce** - Announces filtered members in on-duty.` : ""}`)
                .addField(`**Moderation**`, `>>> **${prefix}kick** __@User (<Reason>)__ - Kicks them, removes them from the database and, if enabled, from the group.\n**${prefix}ban** __<@User> (<Reason>)__ - Bans them, removes them from the database and, if enabled, from the group.\n**${prefix}discharge** __<@User>__ - Removes the user from the database and, if enabled, from the group.\n**${prefix}notice** __<@User or @Role or nothing> <Message>__ - Sends a DM to the mentioned user(s)/role(s)\n**${prefix}purge** __<Amount>__ - Deletes a specified amount of messages.\n**${prefix}inactivity** __<add,remove> <(Length for add only)> <@User>__ - Adds/removes INs.\n**${prefix}inactivity** __<list>__ - Displays all INs.`)
                .addField(`**Misc**`, `>>> **${prefix}update** (<@User>)\n**${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}game** __<1313, alderaan>__ - Displays stats of either 1313 or Alderaan.\n**${prefix}division** <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }else if(perm >= 1){
                const filterLvl = parseInt((await handler.getConfig("Filter-Permission-Level")).Value);

                if(perm >= filterLvl){
                    var embed = new Discord.MessageEmbed()
                    .setTitle(`Quota Bot - Level 1+ Commands (Staff)`)
                    .setColor("#003bed")
                    .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                    .setDescription(`These are the commands for all personnel with permission level 1 or higher: `)
                    .addField(`**Points**`, `>>> **${prefix}points** - Displays your points.\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                    .addField(`**Quota**`, `>>> **${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}quota** - Displays the current quota.`)
                    .addField(`**Filtering**`, `>>> **${prefix}filter** __<@User>__ - Filters a user in.${announceMembers == 1 ? `\n**${prefix}announce** - Announces filtered members in on-duty.` : ""}`)
                    .addField(`**Misc**`, `>>> **${prefix}update**\n**${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}game** __<1313, alderaan>__ - Displays stats of either 1313 or Alderaan.\n**${prefix}division** <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                    .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
        
                    message.channel.send({embeds: [embed]});
                }else{
                    var embed = new Discord.MessageEmbed()
                    .setTitle(`Quota Bot - Level 1+ Commands (Staff)`)
                    .setColor("#003bed")
                    .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                    .setDescription(`These are the commands for all personnel with permission level 1 or higher: `)
                    .addField(`**Points**`, `>>> **${prefix}points** - Displays your points.\n**${prefix}points** __get <@User>__ - Displays the user's points.`)
                    .addField(`**Quota**`, `>>> **${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}quota** - Displays the current quota.`)
                    .addField(`**Misc**`, `>>> **${prefix}update**\n**${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}check** __<Roblox name>__ - Checks for rule violations.\n**${prefix}sg**\n**${prefix}game** __<1313, alderaan>__ - Displays stats of either 1313 or Alderaan.\n**${prefix}division** <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                    .setFooter({text: "Contact PriorAdjudicator#4723 (Henryhre) in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
        
                    message.channel.send({embeds: [embed]});
                }
                
            }else{
                var embed = new Discord.MessageEmbed()
                .setTitle(`Quota Bot - Commands`)
                .setColor("#003bed")
                .setThumbnail("https://cdn.discordapp.com/attachments/702147293150707805/928629423824048218/tacticaldroid.png")
                .setDescription(`These are the commands for standard division members: `)
                .addField(`**Points**`, `>>> **${prefix}points** - Displays your points.`)
                .addField(`**Quota**`, `>>> **${prefix}top** - Displays the top 5 leaderboard.\n**${prefix}quota** - Displays the current quota.`)
                .addField(`**Misc**`, `>>> **${prefix}update**\n**${prefix}info** __<Roblox name or leave this blank>__ - Displays a roblox profile.\n**${prefix}sg**\n**${prefix}game** __<1313, alderaan>__ - Displays stats of either 1313 or Alderaan.\n**${prefix}division** <501st, 212th, RG, CG, RI, ARC, ARF, RC, 104th, TJO>`)
                .setFooter({text: "Contact PriorAdjudicator#4723 in case you encounter any bugs.", iconURL: "https://cdn.discordapp.com/attachments/702147293150707805/928638065554112552/99d00e7d655bdba754a68df0f8ad3e49.png"})
    
                message.channel.send({embeds: [embed]});
            }
        }else if(args.length == 1){
            if(perm == 5){
                let commands = [
                    {
                        name: "game",
                        description: "Displays stats of either 1313 or Alderaan.",
                        category: "Misc",
                        usage: `${prefix}game <1313, alderaan>`,
                        example: `${prefix}game 1313`
                    },
                    {
                        name: "ban",
                        description: "Bans a user, removes them from the database and, if enabled, from the group.",
                        category: "Moderation",
                        usage: `${prefix}ban <@User>\n${prefix}ban <@User> (<Reason>)`,
                        example: `${prefix}ban <@282590125408387073>`
                    },
                    {
                        name: "change",
                        description: "Changes the division's configuration.",
                        category: "Misc",
                        usage: `${prefix}change <Parameter>`,
                        example: `${prefix}change prefix`
                    },
                    {
                        name: "check",
                        description: "Checks a member for rule violations like blacklist or limit violations.",
                        category: "Misc",
                        usage: `${prefix}check <Roblox-name>`,
                        example: `${prefix}check Henryhre`
                    },
                    {
                        name: "filter",
                        description: "Adds a user to the database, gives them the personnel role and accepts them into the group.",
                        category: "Filtering",
                        usage: `${prefix}filter <@User>`,
                        example: `${prefix}filter <@282590125408387073>`
                    },
                    {
                        name: "discharge",
                        description: "Removes a user from the database and, if enabled, from the group.",
                        category: "Moderation",
                        usage: `${prefix}discharge <@User>`,
                        example: `${prefix}discharge <@282590125408387073>`
                    },
                    {
                        name: "inactivity",
                        description: "Adds/Removes inactivity notices.",
                        category: "Moderation",
                        usage: `${prefix}inactvitiy <add,remove> <Number of days> <@User>\n${prefix}inactivity <list>`,
                        example: `${prefix}inactivity add 3 <@282590125408387073>`
                    },
                    {
                        name: "info",
                        description: "Displays information about a roblox user.",
                        category: "Misc",
                        usage: `${prefix}info <Roblox-name>\n${prefix}info`,
                        example: `${prefix}info Henryhre`
                    },
                    {
                        name: "kick",
                        description: "Kicks a user from the discord, removes them from the database and, if enabled, from the group.",
                        category: "Moderation",
                        usage: `${prefix}kick <@User>\n${prefix}kick <@User> (<Reason>)`,
                        example: `${prefix}kick <@282590125408387073>`
                    },
                    {
                        name: "members",
                        description: "Displays all members in the database.",
                        category: "Quota",
                        usage: `${prefix}members`,
                        example: `${prefix}members`
                    },
                    {
                        name: "notice",
                        description: "DMs the specified User(s)/User(s) with the specified role(s) a message.",
                        category: "Moderation",
                        usage: `${prefix}notice <@Role> <Message>\n${prefix}notice <@User(s)> <Message>\n${prefix}notice <Message>`,
                        example: `${prefix}notice <@282590125408387073> Please attend the inspection.`
                    },
                    {
                        name: "points",
                        description: "Adds/Removes points.",
                        category: "Points",
                        usage: `${prefix}points <add,remove> <attend, host${supportsPatrols ? ", patrol" : ""}> <@User>\n${prefix}points get <@User>\n${prefix}points`,
                        example: `${prefix}points add attend 1 <@282590125408387073>`
                    },
                    {
                        name: "purge",
                        description: "Deletes a specified number of messages.",
                        category: "Moderation",
                        usage: `${prefix}purge <Number of messages>`,
                        example: `${prefix}purge 2`
                    },
                    {
                        name: "quotafailures",
                        description: "Displays all quota failures for the week.",
                        category: "Quota",
                        usage: `${prefix}quotafailures`,
                        example: `${prefix}quotafailures`
                    },
                    {
                        name: "resetpoints",
                        description: "Resets the point database.",
                        category: "Quota",
                        usage: `${prefix}resetpoints`,
                        example: `${prefix}resetpoints`
                    },
                    {
                        name: "setup",
                        description: "Starts the setup process.",
                        category: "Misc",
                        usage: `${prefix}setup`,
                        example: `${prefix}setup`
                    },
                    {
                        name: "top",
                        description: "Displays the top 5 leaderboard of the most active members.",
                        category: "Misc",
                        usage: `${prefix}top`,
                        example: `${prefix}top`
                    },
                    {
                        name: "totalevents",
                        description: "Displays a bar chart of all points.",
                        category: "Quota",
                        usage: `${prefix}totalevents <attend, host${supportsPatrols ? ", patrol" : ""}>\n${prefix}totalevents`,
                        example: `${prefix}totalevents`
                    },
                    {
                        name: "update",
                        description: "Checks if a user is linked to a new account on Bloxlink.",
                        category: "Misc",
                        usage: `${prefix}update <@User>\n${prefix}update`,
                        example: `${prefix}update <@282590125408387073>`
                    },
                    {
                        name: "quota",
                        description: "Sets and removes the quota for an individual role.",
                        category: "Quota",
                        usage: `${prefix}quota <set, remove, list> (<@Role or role id>)`,
                        example: `${prefix}quota remove 855578622264737853`
                    },
                    {
                        name: "quotapasses",
                        description: "Displays a list of all personnel who passed this week's quota.",
                        category: "Quota",
                        usage: `${prefix}quotapasses`,
                        example: `${prefix}quotapasses`
                    },
                    {
                        name: "events",
                        description: "Changes the value of different types accordingly.",
                        category: "Quota",
                        usage: `${prefix}events <set> <attend,host> <Amount of Points> <Event name>\n${prefix}events <unset> <attend,host> <Event name>`,
                        example: `${prefix}events set attend 2 BT | Basic Training\n${prefix}events unset attend BT | Basic Training`
                    }
                ]

                if(announceMembers == 1){
                    commands.push({
                        name: "announce",
                        category: "filtering",
                        description: "Announces new members to the division.",
                        usage: `${prefix}announce`,
                        example: `${prefix}announce`,
                        permlevel: 3
                    })
                }

                if(!commands.map(e => e.name).includes(args[0])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Invalid option :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Commands: \n${commands.map(a => `${a.name}`).join("\n")}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return; 
                }
    
                const option = commands.find(e => e.name == args[0]);

                const embed = new Discord.MessageEmbed()
                .setTitle(`${option.name}`)
                .setDescription(`${option.description}`)
                .addField("Category", option.category, true)
                .addField("Usage", "`" + option.usage + "`", true)
                .addField("Example", option.example, true)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).catch(err => {});
            }else if(perm == 4){
                let commands = [
                    {
                        name: "game",
                        description: "Displays stats of either 1313 or Alderaan.",
                        category: "misc",
                        usage: `${prefix}game <1313, alderaan>`,
                        example: `${prefix}game 1313`
                    },
                    {
                        name: "ban",
                        description: "Bans a user, removes them from the database and, if enabled, from the group.",
                        category: "moderation",
                        usage: `${prefix}ban <@User>\n${prefix}ban <@User> (<Reason>)`,
                        example: `${prefix}ban <@282590125408387073>`
                    },
                    {
                        name: "check",
                        description: "Checks a member for rule violations like blacklist or limit violations.",
                        category: "misc",
                        usage: `${prefix}check <Roblox-name>`,
                        example: `${prefix}check Henryhre`
                    },
                    {
                        name: "filter",
                        description: "Adds a user to the database, gives them the personnel role and accepts them into the group.",
                        category: "filtering",
                        usage: `${prefix}filter <@User>`,
                        example: `${prefix}filter <@282590125408387073>`
                    },
                    {
                        name: "discharge",
                        description: "Removes a user from the database and, if enabled, from the group.",
                        category: "moderation",
                        usage: `${prefix}discharge <@User>`,
                        example: `${prefix}discharge <@282590125408387073>`
                    },
                    {
                        name: "inactivity",
                        description: "Adds/Removes inactivity notices.",
                        category: "moderation",
                        usage: `${prefix}inactvitiy <add,remove> <Number of days> <@User>\n${prefix}inactivity <list>`,
                        example: `${prefix}inactivity add 3 <@282590125408387073>`
                    },
                    {
                        name: "info",
                        description: "Displays information about a roblox user.",
                        category: "misc",
                        usage: `${prefix}info <Roblox-name>\n${prefix}info`,
                        example: `${prefix}info Henryhre`
                    },
                    {
                        name: "kick",
                        description: "Kicks a user from the discord, removes them from the database and, if enabled, from the group.",
                        category: "moderation",
                        usage: `${prefix}kick <@User>\n${prefix}kick <@User> (<Reason>)`,
                        example: `${prefix}kick <@282590125408387073>`
                    },
                    {
                        name: "members",
                        description: "Displays all members in the database.",
                        category: "quota",
                        usage: `${prefix}members`,
                        example: `${prefix}members`
                    },
                    {
                        name: "notice",
                        description: "DMs the specified User(s)/User(s) with the specified role(s) a message.",
                        category: "moderation",
                        usage: `${prefix}notice <@Role> <Message>\n${prefix}notice <@User(s)> <Message>\n${prefix}notice <Message>`,
                        example: `${prefix}notice <@282590125408387073> Please attend the inspection.`
                    },
                    {
                        name: "points",
                        description: "Adds/Removes points.",
                        category: "points",
                        usage: `${prefix}points <add,remove> <attend, host${supportsPatrols ? ", patrol" : ""}> <@User>\n${prefix}points get <@User>\n${prefix}points`,
                        example: `${prefix}points add attend 1 <@282590125408387073>`
                    },
                    {
                        name: "purge",
                        description: "Deletes a specified number of messages.",
                        category: "moderation",
                        usage: `${prefix}purge <Number of messages>`,
                        example: `${prefix}purge 2`
                    },
                    {
                        name: "quotafailures",
                        description: "Displays all quota failures for the week.",
                        category: "quota",
                        usage: `${prefix}quotafailures`,
                        example: `${prefix}quotafailures`
                    },
                    {
                        name: "resetpoints",
                        description: "Resets the point database.",
                        category: "quota",
                        usage: `${prefix}resetpoints`,
                        example: `${prefix}resetpoints`
                    },
                    {
                        name: "top",
                        description: "Displays the top 5 leaderboard of the most active members.",
                        category: "misc",
                        usage: `${prefix}top`,
                        example: `${prefix}top`
                    },
                    {
                        name: "totalevents",
                        description: "Displays a bar chart of all points.",
                        category: "quota",
                        usage: `${prefix}totalevents <attend, host${supportsPatrols ? ", patrol" : ""}>\n${prefix}totalevents`,
                        example: `${prefix}totalevents`
                    },
                    {
                        name: "update",
                        description: "Checks if a user is linked to a new account on Bloxlink.",
                        category: "misc",
                        usage: `${prefix}update <@User>\n${prefix}update`,
                        example: `${prefix}update <@282590125408387073>`
                    },
                    {
                        name: "quota",
                        description: "Sets and removes the quota for an individual role.",
                        category: "quota",
                        usage: `${prefix}quota <set, remove, list> (<@Role or role id>)`,
                        example: `${prefix}quota remove 855578622264737853`
                    }
                ]

                if(announceMembers == 1){
                    commands.push({
                        name: "announce",
                        category: "filtering",
                        description: "Announces new members to the division.",
                        usage: `${prefix}announce`,
                        example: `${prefix}announce`,
                        permlevel: 3
                    })
                }

                if(!commands.map(e => e.name).includes(args[0])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Invalid option :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Commands: \n${commands.map(a => `${a.name}`).join("\n")}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return; 
                }
    
                const option = commands.find(e => e.name == args[0]);

                const embed = new Discord.MessageEmbed()
                .setTitle(`${option.name}`)
                .setDescription(`${option.description}`)
                .addField("Category", option.category, true)
                .addField("Usage", "`" + option.usage + "`", true)
                .addField("Example", option.example, true)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).catch(err => {});
            }else if(perm == 3){
                let commands = [
                    {
                        name: "game",
                        description: "Displays stats of either 1313 or Alderaan.",
                        category: "misc",
                        usage: `${prefix}game <1313, alderaan>`,
                        example: `${prefix}game 1313`
                    },
                    {
                        name: "check",
                        description: "Checks a member for rule violations like blacklist or limit violations.",
                        category: "misc",
                        usage: `${prefix}check <Roblox-name>`,
                        example: `${prefix}check Henryhre`
                    },
                    {
                        name: "filter",
                        description: "Adds a user to the database, gives them the personnel role and accepts them into the group.",
                        category: "filtering",
                        usage: `${prefix}filter <@User>`,
                        example: `${prefix}filter <@282590125408387073>`
                    },
                    {
                        name: "info",
                        description: "Displays information about a roblox user.",
                        category: "misc",
                        usage: `${prefix}info <Roblox-name>\n${prefix}info`,
                        example: `${prefix}info Henryhre`
                    },
                    {
                        name: "points",
                        description: "Adds/Removes points.",
                        category: "points",
                        usage: `${prefix}points get <@User>\n${prefix}points`,
                        example: `${prefix}points get <@282590125408387073>`
                    },
                    {
                        name: "top",
                        description: "Displays the top 5 leaderboard of the most active members.",
                        category: "misc",
                        usage: `${prefix}top`,
                        example: `${prefix}top`
                    },
                    {
                        name: "update",
                        description: "Checks if a user is linked to a new account on Bloxlink.",
                        category: "misc",
                        usage: `${prefix}update <@User>\n${prefix}update`,
                        example: `${prefix}update <@282590125408387073>`
                    },
                    {
                        name: "quota",
                        description: "Displays the current quota or the quota that was assigned to one of your roles.",
                        category: "quota",
                        usage: `${prefix}quota`,
                        example: `${prefix}quota`
                    }
                ]

                if(announceMembers == 1){
                    commands.push({
                        name: "announce",
                        category: "filtering",
                        description: "Announces new members to the division.",
                        usage: `${prefix}announce`,
                        example: `${prefix}announce`,
                        permlevel: 3
                    })
                }

                if(!commands.map(e => e.name).includes(args[0])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Invalid option :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Commands: \n${commands.map(a => `${a.name}`).join("\n")}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return; 
                }
    
                const option = commands.find(e => e.name == args[0]);

                const embed = new Discord.MessageEmbed()
                .setTitle(`${option.name}`)
                .setDescription(`${option.description}`)
                .addField("Category", option.category, true)
                .addField("Usage", "`" + option.usage + "`", true)
                .addField("Example", option.example, true)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).catch(err => {});
            }else if(perm >= 1){
                let commands = [
                    {
                        name: "game",
                        description: "Displays stats of either 1313 or Alderaan.",
                        category: "misc",
                        usage: `${prefix}game <1313, alderaan>`,
                        example: `${prefix}game 1313`
                    },
                    {
                        name: "check",
                        description: "Checks a member for rule violations like blacklist or limit violations.",
                        category: "misc",
                        usage: `${prefix}check <Roblox-name>`,
                        example: `${prefix}check Henryhre`
                    },
                    {
                        name: "info",
                        description: "Displays information about a roblox user.",
                        category: "misc",
                        usage: `${prefix}info <Roblox-name>\n${prefix}info`,
                        example: `${prefix}info Henryhre`
                    },
                    {
                        name: "points",
                        description: "Displays your points and the current quota.",
                        category: "points",
                        usage: `${prefix}points get <@User>\n${prefix}points`,
                        example: `${prefix}points get <@282590125408387073>`
                    },
                    {
                        name: "top",
                        description: "Displays the top 5 leaderboard of the most active members.",
                        category: "misc",
                        usage: `${prefix}top`,
                        example: `${prefix}top`
                    },
                    {
                        name: "update",
                        description: "Checks if a user is linked to a new account on Bloxlink.",
                        category: "misc",
                        usage: `${prefix}update`,
                        example: `${prefix}update`
                    },
                    {
                        name: "quota",
                        description: "Displays the current quota or the quota that was assigned to one of your roles.",
                        category: "quota",
                        usage: `${prefix}quota`,
                        example: `${prefix}quota`
                    }
                ]


                if(!commands.map(e => e.name).includes(args[0])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Invalid option :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Commands: \n${commands.map(a => `${a.name}`).join("\n")}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return; 
                }
    
                const option = commands.find(e => e.name == args[0]);

                const embed = new Discord.MessageEmbed()
                .setTitle(`${option.name}`)
                .setDescription(`${option.description}`)
                .addField("Category", option.category, true)
                .addField("Usage", "`" + option.usage + "`", true)
                .addField("Example", option.example, true)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).catch(err => {});
            }else{
                let commands = [
                    {
                        name: "game",
                        description: "Displays stats of either 1313 or Alderaan.",
                        category: "misc",
                        usage: `${prefix}game <1313, alderaan>`,
                        example: `${prefix}game 1313`
                    },
                    {
                        name: "info",
                        description: "Displays information about a roblox user.",
                        category: "misc",
                        usage: `${prefix}info <Roblox-name>\n${prefix}info`,
                        example: `${prefix}info Henryhre`
                    },
                    {
                        name: "points",
                        description: "Displays your points and the current quota.",
                        category: "points",
                        usage: `${prefix}points`,
                        example: `${prefix}points`
                    },
                    {
                        name: "top",
                        description: "Displays the top 5 leaderboard of the most active members.",
                        category: "misc",
                        usage: `${prefix}top`,
                        example: `${prefix}top`
                    },
                    {
                        name: "update",
                        description: "Checks if a user is linked to a new account on Bloxlink.",
                        category: "misc",
                        usage: `${prefix}update`,
                        example: `${prefix}update`
                    },
                    {
                        name: "quota",
                        description: "Displays the current quota or the quota that was assigned to one of your roles.",
                        category: "quota",
                        usage: `${prefix}quota`,
                        example: `${prefix}quota`
                    }
                ]


                if(!commands.map(e => e.name).includes(args[0])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Invalid option :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Commands: \n${commands.map(a => `${a.name}`).join("\n")}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]})
                    return; 
                }
    
                const option = commands.find(e => e.name == args[0]);

                const embed = new Discord.MessageEmbed()
                .setTitle(`${option.name}`)
                .setDescription(`${option.description}`)
                .addField("Category", option.category, true)
                .addField("Usage", "`" + option.usage + "`", true)
                .addField("Example", option.example, true)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]}).catch(err => {});
            }
        }
    }
}