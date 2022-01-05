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

        const validargs = [
            {
                name: "prefix",
                require: "string",
                reply: "Successfully set the prefix to: ",
                config_query: "Prefix",
                example: "!"
            },
            {
                name: "permission",
                require: "Role mention",
                reply: "",
                permission: true
            },
            {
                name: "divColor",
                require: "hex",
                reply: "Successfully set the divisional color to: ",
                config_query: "Divisional-Color",
                example: "#ffff"
            },
            {
                name: "attendQuota",
                require: "number",
                reply: "Successfully set the attendance quota to: ",
                config_query: "Attend-Quota",
                example: "3"
            },
            {
                name: "patrolQuota",
                require: "number",
                reply: "Successfully set the patrol quota to: ",
                config_query: "Attend-Quota",
                example: "2"
            },
            {
                name: "patrolMinutes",
                require: "number",
                reply: "Successfully set the value for one patrol point to: ",
                config_query: "Patrol-Minutes",
                example: "30"
            },
            {
                name: "hostQuota",
                require: "number",
                reply: "Successfully set the hosting quota to: ",
                config_query: "Hosting-Quota",
                example: "3"
            },
            {
                name: "staffAttendQuota",
                require: "number",
                reply: "Successfully set the staff attendance quota to: ",
                config_query: "Staff-Attendance-Quota",
                example: "1"
            },
            {
                name: "staffPatrolQuota",
                require: "number",
                reply: "Successfully set the staff patrol quota to: ",
                config_query: "Staff-Patrol-Quota",
                example: "1"
            },
            {
                name: "groupId",
                require: "number",
                reply: "Successfully set the group Id to: ",
                config_query: "Roblox-Group-Id",
                example: "2742631"
            },
            {
                name: "autoRank",
                require: "bool",
                reply: "Auto rank enabled: ",
                config_query: "Auto-Rank",
                example: "Yes"
            },
            {
                name: "twoPicturePatrols",
                require: "bool",
                reply: "Two picture patrols enabled: ",
                config_query: "Two-Pictures-Patrols",
                example: "No"
            },
            {
                name: "announceMembers",
                require: "bool",
                reply: "Announce members enabled: ",
                config_query: "Announce-Members",
                example: "No"
            },
            {
                name: "announceChannel",
                require: "Channel mention",
                switchable: true,
                reply: "Announce members channel: ",
                config_query: "Announce-channel",
                example: "#Channel"
            },
            {
                name: "personnelRole",
                require: "Role mention",
                switchable: true,
                reply: "Personnel role Id: ",
                config_query: "Personnel-Id",
                example: "@Role"
            },
            {
                name: "inactivityRole",
                require: "Role mention",
                switchable: true,
                reply: "Inactivity role Id: ",
                config_query: "Inactivity-Role-Id",
                example: "@Role"
            },
            {
                name: "newMembersRole",
                require: "Role mention",
                switchable: true,
                reply: "New members role Id: ",
                config_query: "New-Role-Id",
                example: "@Role"
            },
            {
                name: "newStaffRole",
                require: "Role mention",
                switchable: true,
                reply: "New staff role Id: ",
                config_query: "New-Staff-Role-Id",
                example: "@Role"
            },
            {
                name: "divisionName",
                require: "string",
                reply: "Successfully set the division name to: ",
                config_query: "Division-Name",
                example: "Senate Guard"
            },
            {
                name: "divisionType",
                require: "string",
                reply: "Successfully set the division type to: ",
                config_query: "Division-Type",
                example: "Main"
            },
            {
                name: "loggingChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Logging channel: ",
                config_query: "Logging-Channel",
                example: "#Channel"
            },
            {
                name: "reactLogsChannel",
                require: "Channel mention",
                switchable: false,
                reply: "React logs channel: ",
                config_query: "React-Logs-Channel",
                example: "#Channel"
            },
            {
                name: "inactivityAppealsChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Inactivity appeals channel: ",
                config_query: "Inactivity-Appeals-Channel",
                example: "#Channel"
            },
            {
                name: "rbxAuditLogs",
                require: "Channel mention",
                switchable: false,
                reply: "Roblox audit logs channel: ",
                config_query: "Rbx-Audit-Channel",
                example: "#Channel"
            },
            {
                name: "inactivityChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Inactivity channel: ",
                config_query: "Inactivity-Channel",
                example: "#Channel"
            },
            {
                name: "botCommandsChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Bot commands channel: ",
                config_query: "Automata-Channel",
                example: "#Channel"
            },
            {
                name: "activityLogsChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Activity logs channel: ",
                config_query: "Activity-Logs-Channel",
                example: "#Channel"
            },
            {
                name: "eventLogsChannel",
                require: "Channel mention",
                switchable: false,
                reply: "Event logs channel: ",
                config_query: "Event-Logs-Channel",
                example: "#Channel"
            },
            {
                name: "patrolLogsChannel",
                require: "Channel mention",
                switchable: true,
                reply: "Patrol logs channel: ",
                config_query: "Patrol-Logs-Channel",
                example: "#Channel"
            },
            {
                name: "filteringChannel",
                require: "Channel mention",
                switchable: true,
                reply: "Filtering channel: ",
                config_query: "Filtering-Channel",
                example: "#Channel"
            },
            {
                name: "patrolsAwardActivity",
                require: "bool",
                reply: "Patrols award activity points: ",
                config_query: "Patrols-Award-Activity",
                example: "No"
            }
        ]

        const permquestions = [
            {
                question: "Please ping all the roles you want to assign permission level 5. :nine:",
                level: 5,
                permission: true,
                desc: "Please ping all roles that are meant to have access to all commands. Normally this is given to the Commander and XO.",
                require: "Role-Mention",
                reply: "The following roles now have access to all commands: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 4. :one::zero:",
                level: 4,
                permission: true,
                desc: "Please ping all roles that have access to almost all commands except resetpoints. Normally this is given to AOs.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 4: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 3. :one::one:",
                level: 3,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 3 which grants access to standard commands only. This is normally given to CCs or CC like roles to identify them as CC.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 3: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 2. :one::two:",
                level: 2,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 2 which grants access to standard commands only. This is reserved for LTs and JCs.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 2: "
            },
            {
                question: "Please ping all the roles you want to assign permission level 1. :one::three:",
                level: 1,
                permission: true,
                desc: "Please ping all roles that are to receive permission level 1 which grants access to standard commands only. This is the level for normal staff members like Ensigns, Corporals, etc.",
                require: "Role-Mention",
                reply: "The following roles now have permission level 1: "
            },
            {
                question: "Please ping all company roles. :one::four:",
                permission: false,
                type: "company",
                desc: "This is necessary in order for the auto rank roblox group feature to work.",
                require: "Role-Mention",
                reply: "Company roles: "
            },
            {
                question: "Please ping the trooper role. :one::five:",
                permission: false,
                type: "trooper",
                desc: "If you don't have one, simply say 'No'",
                require: "Role-Mention",
                reply: "Trooper role: "
            },
            {
                question: "Please ping the enlist role. :one::six:",
                permission: false,
                type: "enlist",
                desc: "This is necessary for the auto rank feature to work.",
                require: "Role-Mention",
                reply: "Enlist role: "
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
                .setDescription(`Options: \n${validargs.map(a => `${a.name}`).join("\n")}`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }

            const option = validargs.find(e => e.name == args[0]);
            const currentvalue = (await handler.getConfig(option.config_query)).Value;
            const filter = m => m.author.id === message.author.id;
            const supportsPatrols = handler.supportsPatrols();

            if(option.name.toLocaleLowerCase().includes("patrol") && !supportsPatrols){
                const embed = new Discord.MessageEmbed()
                .setTitle('Patrols turned off :warning:')
                .setColor("#ed0909")
                .setDescription(`Unable to change settings for a disabled featuer. Use the ${prefix}change patrols command to enable it.`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }

            if(option.require == "string"){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Change parameter: ${option.name}`)
                .setColor("#0e64e6")
                .setDescription(`Current value: **${currentvalue}**\nPlease reply with a word. Example: ${option.example}`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]}) 

                const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                handler.updateConfig(option.config_query, answer.content);

                const embed1 = new Discord.MessageEmbed()
                .setTitle(option.reply + answer.content)
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed1]})
            }
            if(option.require == "number"){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Change parameter: ${option.name}`)
                .setColor("#0e64e6")
                .setDescription(`Current value: **${currentvalue}**\nPlease reply with a number. Example: ${option.example}`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]});

                const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                if(isNaN(answer.content)){
                    const embed1 = new Discord.MessageEmbed()
                    .setTitle('Incorrect answer :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please execute the command again. Response type required: ${option.require}`)
                    .setFooter(Index.footer)
                    .setTimestamp()

                    message.channel.send({embeds: [embed1]})
                    return;
                }

                handler.updateConfig(option.config_query, answer.content);

                const embed1 = new Discord.MessageEmbed()
                .setTitle(option.reply + answer.content)
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed1]})
            }
            if(option.require == "bool"){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Change parameter: ${option.name}`)
                .setColor("#0e64e6")
                .setDescription(`Current value: **${currentvalue}**\nPlease reply with **Yes** or **No**. Example: ${option.example}`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]});

                const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                if(answer.content.toUpperCase() != "YES" && answer.content.toUpperCase() != "NO"){
                    const embed1 = new Discord.MessageEmbed()
                    .setTitle('Incorrect answer :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please execute the command again. Response required: Yes/No`)
                    .setFooter(Index.footer)
                    .setTimestamp()

                    message.channel.send({embeds: [embed1]})
                    return;
                }

                handler.updateConfig(option.config_query, answer.content.toUpperCase() == "YES" ? 1 : 0);

                const embed1 = new Discord.MessageEmbed()
                .setTitle(option.reply + answer.content)
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed1]})
            }
            if(option.require == "hex"){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Change parameter: ${option.name}`)
                .setColor("#0e64e6")
                .setDescription(`Current value: **${currentvalue}**\nPlease reply with a hex code. Example: ${option.example}`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]});

                const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                if(!answer.content.startsWith("#")){
                    const embed1 = new Discord.MessageEmbed()
                    .setTitle('Incorrect answer :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please execute the command again. Response required: Hex code. Example: ${option.example}`)
                    .setFooter(Index.footer)
                    .setTimestamp()

                    message.channel.send({embeds: [embed1]})
                    return;
                }

                handler.updateConfig(option.config_query, answer.content);

                const embed1 = new Discord.MessageEmbed()
                .setTitle(option.reply + answer.content)
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed1]})
            }
            if(option.require == "Channel mention"){
                const embed = new Discord.MessageEmbed()
                .setTitle(`Change parameter: ${option.name}`)
                .setColor("#0e64e6")
                .setDescription(`Current value: **${currentvalue}**\nPlease mention a channel or reply with 0 to disable the feature. Example: ${option.example}`)
                .setFooter(Index.footer)
                .setTimestamp();
            
                message.channel.send({embeds: [embed]});

                const answer = await awaitMessage(filter, message.channel).catch(err => {return;});

                if(answer.content == "0"){
                    if(!option.switchable){
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Option cannot be disabled :x:')
                        .setColor("#ed0909")
                        .setDescription(`Please execute the command again as this option cannot be disabled. This is the case for certain settings that are crucial for the proper functioning of this bot.`)
                        .setFooter(Index.footer)
                        .setTimestamp()
    
                        message.channel.send({embeds: [embed1]})
                        return;
                    }
                    handler.updateConfig(question.config_query, "0");
                }else{
                    if(answer.mentions.channels.first() == undefined || answer.mentions.channels.first() == null){
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Incorrect answer :x:')
                        .setColor("#ed0909")
                        .setDescription(`Please execute the command again. Response required: Channel mention.`)
                        .setFooter(Index.footer)
                        .setTimestamp()
    
                        message.channel.send({embeds: [embed1]})
                        return;
                    }
                    handler.updateConfig(option.config_query, answer.mentions.channels.first().id);

                    const embed1 = new Discord.MessageEmbed()
                    .setTitle(option.reply + answer.mentions.channels.first().id)
                    .setColor("#56d402")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed1]})
                }
            }

            if(option.require == "Role mention"){
                if(option.permission == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle(`Change parameter: ${option.name}`)
                    .setColor("#0e64e6")
                    .setDescription(`Current value: **${currentvalue}**\nPlease mention a channel or reply with 0 to disable the feature. Example: ${option.example}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                
                    message.channel.send({embeds: [embed]});

                    const answer = await awaitMessage(filter, message.channel);
                    if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                        const embed1 = new Discord.MessageEmbed()
                        .setTitle('Incorrect answer :x:')
                        .setColor("#ed0909")
                        .setDescription(`Please execute the command again. Response required: Role mention.`)
                        .setFooter(Index.footer)
                        .setTimestamp()
    
                        message.channel.send({embeds: [embed1]})
                        return;
                    }

                    handler.updateConfig(option.config_query, answer.mentions.roles.first().id);

                    const embed1 = new Discord.MessageEmbed()
                    .setTitle(option.reply + answer.mentions.roles.first().id)
                    .setColor("#56d402")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed1]})
                }else{
                    await handler.clearPermission();
                    await handler.clearRoles();

                    for(question of permquestions){
                        const embed = new Discord.MessageEmbed()
                        .setTitle(question.question)
                        .setColor("#0e64e6")
                        .setDescription(question.desc)
                        .setFooter(Index.footer)
                        .setTimestamp();

                        message.channel.send({embeds: [embed]});
    
                        const answer = await awaitMessage(filter, message.channel);

                        if(question.type == "trooper"){
                            if(answer.content.toUpperCase() == "NO"){
                                handler.updateRobloxRole("0", 0, "trooper");

                                const embed2 = new Discord.MessageEmbed()
                                .setTitle(question.reply + "0")
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed2]})
                            }else{
                                if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle('Incorrect answer :x:')
                                    .setColor("#ed0909")
                                    .setDescription(`Please execute the command again.`)
                                    .setFooter(Index.footer)
                                    .setTimestamp()
        
                                    message.channel.send({embeds: [embed1]})
                                    return;
                                }else{
                                    var roles = answer.mentions.roles.first(answer.mentions.roles.size);
        
                                    for(role of roles){
                                        if(question.permission){
                                            handler.updatePermission(role.id, question.level)
                                        }
                                        if(question.type == "company"){
                                            handler.updateRobloxRole(role.id, 0, "company"); 
                                        }else if(question.type == "trooper"){
                                            handler.updateRobloxRole(role.id, 0, "trooper");
                                        }else if(question.type == "enlist"){
                                            handler.updateRobloxRole(role.id, 0, "enlist");
                                        }else{
                                            handler.updateRobloxRole(role.id, 0, "staff");
                                        } 
                                    }
        
                                    var string = roles.map(r => r.id).join(", ");
                                    
                                    const embed1 = new Discord.MessageEmbed()
                                    .setTitle(question.reply + string)
                                    .setColor("#56d402")
                                    .setDescription(``)
                                    .setFooter(Index.footer)
                                    .setTimestamp();
                    
                                    message.channel.send({embeds: [embed1]})
                                }
                            }
                        }else{
                            if(answer.mentions.roles.first() == undefined || answer.mentions.roles.first() == null){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Please execute the command again.`)
                                .setFooter(Index.footer)
                                .setTimestamp()
    
                                message.channel.send({embeds: [embed1]})
                                return;
                            }else{
                                var roles = answer.mentions.roles.first(answer.mentions.roles.size);
    
                                for(role of roles){
                                    if(question.permission){
                                        handler.updatePermission(role.id, question.level)
                                    }
                                    if(question.type == "company"){
                                        handler.updateRobloxRole(role.id, 0, "company"); 
                                    }else if(question.type == "trooper"){
                                        handler.updateRobloxRole(role.id, 0, "trooper");
                                    }else if(question.type == "enlist"){
                                        handler.updateRobloxRole(role.id, 0, "enlist");
                                    }else{
                                        handler.updateRobloxRole(role.id, 0, "staff");
                                    } 
                                }
    
                                var string = roles.map(r => r.id).join(", ");
                                
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle(question.reply + string)
                                .setColor("#56d402")
                                .setDescription(``)
                                .setFooter(Index.footer)
                                .setTimestamp();
                
                                message.channel.send({embeds: [embed1]})
                            }
                        }
                    }
                    const robloxroles1 = await handler.getRobloxRoles();
                    for(let i=0; i<robloxroles1.length; i++){
                        if(robloxroles1[i].id != 0){
                            const embed = new Discord.MessageEmbed()
                            .setTitle("What is the rank id of the following role?")
                            .setColor("#0e64e6")
                            .setDescription(`Role: <@&${robloxroles1[i].id}>`)
                            .setFooter(Index.footer)
                            .setTimestamp();
                        
                            message.channel.send({embeds: [embed]})

                            const answer1 = await awaitMessage(filter, message.channel);
                            
                            if(isNaN(answer1.content)){
                                const embed1 = new Discord.MessageEmbed()
                                .setTitle('Incorrect answer :x:')
                                .setColor("#ed0909")
                                .setDescription(`Execute this command again. Then reply with a number if asked about rank ids.`)
                                .setFooter(Index.footer)
                                .setTimestamp();
    
                                message.channel.send({embeds: [embed1]})
                                return;
                            }

                            handler.updateRobloxRole(robloxroles1[i].id, parseInt(answer1.content));
        
                            const txt1 = new Discord.MessageEmbed()
                            .setTitle("Rank id update")
                            .setColor("#56d402")
                            .setDescription(`Role <@&${robloxroles1[i].id}>\nRank Id: ${answer1.content}`)
                            .setFooter(Index.footer)
                            .setTimestamp();
            
                            message.channel.send({embeds: [txt1]})
                        }
                    }
                }
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Invalid option :warning:')
            .setColor("#ed0909")
            .setDescription(`Options: \n${validargs.map(a => `- ${a.name}`).join("\n")}`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}

async function awaitMessage(filter, channel){
    return new Promise(async (resolve, reject) =>{
        await channel.awaitMessages({filter, max: 1, time: 240000, errors: ['time']})
        .then(collected =>{
            return resolve(collected.first());
        })
        .catch(collected =>{

            const embed = new Discord.MessageEmbed()
            .setTitle('Process cancelled :x:')
            .setColor("#ed0909")
            .setDescription(`The process was cancelled due to inactivity.`)
            .setFooter(Index.footer)
            .setTimestamp();
                      
            channel.send({embeds: [embed]})
            return reject();
        })
    })
}