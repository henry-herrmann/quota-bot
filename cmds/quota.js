const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "quota",
    async execute(message, args, handler, client){

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
            require("./points").execute(message, args, handler, client);
        }else if(args.length == 2){
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

            if(args[0] == "set"){

                let role;

                if(message.mentions.roles.first() == undefined){
                    if(args[1] == undefined || isNaN(args[1])){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Mention a role or provide the role id in case the role was deleted.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
        
                        message.channel.send({embeds: [embed]})
                        return;
                    }else{
                        role = {
                            id: args[1]
                        };
                    }
                }else{
                    role = message.mentions.roles.first();
                }

                const filter = m => m.author.id === message.author.id;

                const embed = new Discord.MessageEmbed()
                .setTitle("What attendance quota would you set for this role?")
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed]});

                const attend = await awaitMessage(filter, message.channel);

                if(attend.content.toUpperCase() == "CANCEL"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                } 

                if(isNaN(attend.content)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please reply with a number!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }

                const embed1 = new Discord.MessageEmbed()
                .setTitle("What hosting quota would you set for this role?")
                .setColor("#56d402")
                .setDescription(``)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed1]});

                const host = await awaitMessage(filter, message.channel);

                if(host.content.toUpperCase() == "CANCEL"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                } 

                if(isNaN(host.content)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please reply with a number!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }

                const embed2 = new Discord.MessageEmbed()
                .setTitle("What patrol quota would you set for this role?")
                .setColor("#56d402")
                .setDescription(`Reply with 0 if patrols are disabled.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed2]});

                const patrol = await awaitMessage(filter, message.channel);

                if(patrol.content.toUpperCase() == "CANCEL"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                } 

                if(isNaN(patrol.content)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please reply with a number!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }

                const embed3 = new Discord.MessageEmbed()
                .setTitle("Would you like this quota to always count?")
                .setColor("#56d402")
                .setDescription(`Example: A captain has the captain role but also the scrim team role, normally only the captain's quota would count but the scrim team qutoa also counts.`)
                .setFooter(Index.footer)
                .setTimestamp();
        
                message.channel.send({embeds: [embed3]});

                const override = await awaitMessage(filter, message.channel);

                if(override.content.toUpperCase() == "CANCEL"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(``)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                } 

                if(override.content.toUpperCase() != "NO" && override.content.toUpperCase() != "YES"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`Please reply with Yes or No!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }

                try {
                    await handler.setRoleQuota(role.id, parseFloat(attend.content), parseFloat(host.content), parseFloat(patrol.content), override.content.toUpperCase() == "YES" ? 1 : 0)

                    const embed4 = new Discord.MessageEmbed()
                    .setTitle("Success!")
                    .setColor("#56d402")
                    .setDescription(`Role: <@&${role.id}>\nAttendance quota: ${attend.content}\nHosting quota: ${host.content}\nPatrol quota: ${patrol.content}\nOverride: ${override.content}`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed4]});
                } catch (error) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`There was an error with the database.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }

            }else if(args[0] == "remove"){
                let role;

                if(message.mentions.roles.first() == undefined){
                    if(isNaN(args[1])){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Error :warning:')
                        .setColor("#ed0909")
                        .setDescription(`Mention a role or provide the role id in case the role was deleted.`)
                        .setFooter(Index.footer)
                        .setTimestamp();
        
                        message.channel.send({embeds: [embed]})
                        return;
                    }else{
                        role = {
                            id: args[1]
                        };
                    }
                }else{
                    role = message.mentions.roles.first();
                }

                try {
                    await handler.deleteRoleQuota(role.id);

                    const embed4 = new Discord.MessageEmbed()
                    .setTitle("Success!")
                    .setColor("#56d402")
                    .setDescription(`Role quota removed.\nRole: <@&${role.id}> (${role.id})`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed4]});
                } catch (error) {
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Process cancelled :x:')
                    .setColor("#ed0909")
                    .setDescription(`There was an error with the database.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                              
                    message.channel.send({embeds: [embed]})
                }
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}quota <set, remove, list>`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }
        }else if(args.length == 1){
            if(args[0] == "list"){
                const quotas = await handler.getRoleQuotas();

                const string = [];

                for(const quota of quotas){
                    string.push(`<@&${quota.roleid}>:\n- A: ${quota.Attend}\n- H: ${quota.Host}\n- P: ${quota.Patrol}`)
                }

                const embed = new Discord.MessageEmbed()
                .setTitle("Quotas")
                .setDescription(string.join("\n"))
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]});
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}quota <set, remove, list>`)
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

            return resolve({
                content: "cancel"
            });
        })
    })
}