const Discord = require('discord.js');
const Index = require("../index")
const { Util } = require("discord.js");
const dateFormat = require("dateformat");

module.exports = {
    name: "inactivity",
    async execute(message, args, client, handler){
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

        const inactivityid = (await handler.getConfig("Inacitivty-Role-Id")).Value;
        const inactivitychannelid = (await handler.getConfig("Inactivity-Channel")).Value;

        if(args.length == 1){
            if(args[0].toUpperCase() == "LIST"){
                const notices = await handler.getInactivityNotices();

                let arr = [];
    
                for(const notice of notices){
                    const startDate = new Date(notice.StartDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
                    const endDate = new Date(notice.EndDate).toLocaleString('en-US', {timeZone: 'America/New_York'});
                    var start = dateFormat(startDate, "m/d/yy");
                    var end = dateFormat(endDate, "m/d/yy");
    
                    arr.push(`- [<@${notice.Id}>]: Start: ${start}, End: ${end}, Reason: ${notice.Reason}, MessageId: ${notice.MessageID}`);
                }
                const msg = arr.join("\n");
                const string = await Util.splitMessage(msg, { maxLength: 2000 });
                message.channel.send("Inactivity Notices: \n" + string);
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}inactivity <add,remove, list> (<Length> for add) (@User)`)
                .setFooter(Index.footer)
                .setTimestamp();
                message.channel.send({embeds: [embed]})
                return;
            }
        }else if(args.length == 2){
            if(args[0] == "remove"){
                if(message.mentions.users.first() == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Error :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Mention a user.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
      
                    message.channel.send({embeds: [embed]})
                    return;
                }
                const mention = message.mentions.users.first() || client.users.cache.get(args[0]);
                if(!mention){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Error :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Mention a user.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
    
                    message.channel.send({embeds: [embed]})
                    return;
                }

                var member = message.mentions.users.first(), user;
                if(member) user = await message.guild.members.fetch(member);

                if(!await handler.isOnInactivityNotice(user.id)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('User not on IN :warning:')
                    .setColor("#ed0909")
                    .setDescription(`The mentioned user is not on an Inactivity Notice.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed]}).catch(() =>{});
                    return;
                }

                user.roles.remove(message.guild.roles.cache.find(r => r.id == inactivityid)).catch(err =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Inactivity Role Id not found :warning:')
                    .setColor("#ed0909")
                    .setDescription(`We were unable to locate the id for the IN role. Please add the role id using the ${prefix}change command!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed]}).catch(() =>{});
                });

                client.channels.cache.get(inactivitychannelid).messages.fetch({limit: 100}).then((messages) =>{
                    const msgs = messages.filter(m => m.author.id === user.id);
                    msgs.forEach((msg) =>{
                      if(msg != null && msg != undefined){
                        msg.delete().catch(() =>{});
                        return;
                      }
                    })
                })


                handler.removeInactivityNotice(user.id);

                const embed = new Discord.MessageEmbed()
                .setTitle('IN removed :white_check_mark:')
                .setColor("#56d402")
                .setDescription(`Successfully removed the IN of <@${user.id}>`)
                .setFooter(Index.footer)
                .setTimestamp();
                message.channel.send({embeds: [embed]})
            }
        }else if(args.length == 3){
            if(args[0] == "add"){
                if(message.mentions.users.first() == undefined){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Error :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Mention a user.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
      
                    message.channel.send({embeds: [embed]})
                    return;
                }
                const mention = message.mentions.users.first() || client.users.cache.get(args[0]);
                if(!mention){
                  const embed = new Discord.MessageEmbed()
                  .setTitle('Error :warning:')
                  .setColor("#ed0909")
                  .setDescription(`Mention a user.`)
                  .setFooter(Index.footer)
                  .setTimestamp();
    
                  message.channel.send({embeds: [embed]})
                  return;
                }
                var member = message.mentions.users.first(), user;
                if(member) user = await message.guild.members.fetch(member);


                var length = args[1];

                if(isNaN(length)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect Inactivity Notice :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Please follow the correct format.\n__Errors in your message: Stated amount of **days** is not a number.__`)
                    .setFooter(Index.footer)
                    .setTimestamp();
        
                    message.channel.send({embeds: [embed]}).catch(() =>{});
                    return;
                }

                const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
                const startDate = new Date(now.toString())

                var endDate = new Date(startDate.getTime() + (86400000 * length));

                if(await handler.isOnInactivityNotice(user.id)){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('User already on IN :warning:')
                    .setColor("#ed0909")
                    .setDescription(`The mentioned user is already on an Inactivity Notice.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed]}).catch(() =>{});
                    return;
                }

                user.roles.add(message.guild.roles.cache.find(r => r.id == inactivityid)).catch(err =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Inactivity Role Id not found :warning:')
                    .setColor("#ed0909")
                    .setDescription(`We were unable to locate the id for the IN role. Please add the role id using the ${prefix}change command!`)
                    .setFooter(Index.footer)
                    .setTimestamp();
            
                    message.channel.send({embeds: [embed]}).catch(() =>{});
                });

                handler.addInactivityNotice(user.id, startDate.toString(), endDate.toString(), "Added manually", "0");

                
                const embed = new Discord.MessageEmbed()
                .setTitle('IN added :white_check_mark:')
                .setColor("#56d402")
                .setDescription(`Successfully added an IN to <@${user.id}> with the length of **${length}** days.`)
                .setFooter(Index.footer)
                .setTimestamp();
                message.channel.send({embeds: [embed]})
            }
            
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}inactivity <add,remove, list> (<Length> for add) (@User)`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}