const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "resetpoints",
    async execute(message, args, handler, client){
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

        const color = (await handler.getConfig("Divisional-Color")).Value;

        if(args.length == 0){
            const filter = m => m.author.id === message.author.id;

            const robloxEmbed = new Discord.MessageEmbed()
            .setColor("#003bed")
            .setTitle("Prompt will expire in 45 seconds")
            .setDescription("❓ Are you sure you want to reset the database and point roles? **Reply with (Yes/No).**")
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [robloxEmbed]});


            const answer = await awaitMessage(filter, message.channel).catch(err =>{});

            if(answer.content.toLowerCase() == "no"){
                const embed = new Discord.MessageEmbed()
                .setColor("#ed0909")
                .setDescription(`❌ Prompt cancelled.`)
                .setFooter(Index.footer)
                .setTimestamp();

                message.channel.send({embeds: [embed]})
                return;
            }

            var embed = new Discord.MessageEmbed()
            .setTitle("Database reset in progress :wrench:")
            .setColor("#ebe71c")
            .setDescription(`This can take up to 2 minutes. **Stand by.**`)
            .setFooter(Index.footer)
            .setTimestamp()
            message.channel.send({embeds: [embed]})

            handler.resetPoints().then(async () =>{
                const personnelid = (await handler.getConfig("Personnel-Id")).Value;
                const newstaffid = (await handler.getConfig("New-Staff-Role-Id")).Value;
                const newid = (await handler.getConfig("New-Role-Id")).Value;

                new Promise((resolve, reject) =>{
                    client.guilds.cache.get(handler.getGuildID()).members.fetch().then(members =>{
                        const Role = client.guilds.cache.get(handler.getGuildID()).roles.cache.find(role => role.id == personnelid);
    
                        members.filter(member => member.roles.cache.find(role => role == Role)).forEach((member) =>{
                            member.roles.remove(member.guild.roles.cache.find(r => r.id == newstaffid));
                            member.roles.remove(member.guild.roles.cache.find(r => r.id == newid));
                        })
                        resolve();
                    })
                }).then(() =>{
                    var embed = new Discord.MessageEmbed()
                    .setTitle("Quota reset done :white_check_mark:")
                    .setColor(color)
                    .setDescription(`The database was reset and is ready for another week's quota. Glory.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
  
                    message.channel.send({embeds: [embed]})
                })
            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}resetpoints`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}

async function awaitMessage(filter, channel){
    return new Promise(async (resolve, reject) =>{
        await channel.awaitMessages({filter, max: 1, time: 45000, errors: ['time']})
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