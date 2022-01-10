const Discord = require("discord.js");
const Index = require("../index");

module.exports = {
    name: "events",
    async execute(message, args, handler){
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
        const supportsPatrols = handler.supportsPatrols();


        if(args.length == 0){
            const events = await handler.getEventTypes();

            message.channel.send("Event types:\n" + events.map(e => `- ${e.Name} : ${e.Type} : ${e.Points}`).join("\n"));
        }else if(args.length > 2){
            if(args[0].toLowerCase() == "set"){
                if(args.length <= 3){
                    const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host${supportsPatrols ? ",patrol" : ""}> <Event name>\n${prefix}events <unset> <Event name>`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                          
                        message.channel.send({embeds: [embed]})
                        return;
                }

                if(supportsPatrols){
                    if(args[1].toLowerCase() != "patrol" && args[1].toLowerCase() != "attend" && args[1].toLowerCase() != "host"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host${supportsPatrols ? ",patrol" : ""}> <Event name>\n${prefix}events <unset> <Event name>`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                          
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }else{
                    if(args[1].toLowerCase() != "attend" && args[1].toLowerCase() != "host"){
                        const embed = new Discord.MessageEmbed()
                        .setTitle('Incorrect usage :warning:')
                        .setColor("#ed0909")
                        .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host> <Event name>\n${prefix}events <unset> <Event name>`)
                        .setFooter(Index.footer)
                        .setTimestamp();
                          
                        message.channel.send({embeds: [embed]})
                        return;
                    }
                }

                if(!parseFloat(args[2])){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`Please state a valid number of points.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                      
                    message.channel.send({embeds: [embed]})
                    return;
                }

                const eventtype = args[1].toLowerCase();
                const points = parseFloat(args[2]);
                const name = args.splice(3).join(" ");

                handler.updateEventType(name, eventtype, points).then(() =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Event added :white_check_mark:')
                    .setColor("#56d402")
                    .setDescription(`Name: ${name}\nType: ${eventtype}\nPoints: ${points}`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
                }).catch((err) =>{
                    console.log(err);

                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`There was an error with the database, please contact Henryhre.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                      
                    message.channel.send({embeds: [embed]})
                    return;
                })
            }else if(args[0].toLowerCase() == "unset"){
                if(args.length <= 2){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host${supportsPatrols ? ",patrol" : ""}> <Event name>\n${prefix}events <unset> <Event name>`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                      
                    message.channel.send({embeds: [embed]})
                    return;
                }

                const eventtype = args[1];
                const name = args.splice(2).join(" ");

                const event = await handler.getEventType(name, eventtype);

                if(event.Name == "other"){
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Error :warning:')
                    .setColor("#ed0909")
                    .setDescription(`That event does not exist`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                      
                    message.channel.send({embeds: [embed]})
                    return;
                }

                handler.deleteEventType(name, eventtype).then(() =>{
                    const embed = new Discord.MessageEmbed()
                    .setTitle('Event removed :wastebasket:')
                    .setColor("#56d402")
                    .setDescription(`Name: ${name}\nType: ${eventtype}`)
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
                }).catch((err) =>{
                    console.log(err);

                    const embed = new Discord.MessageEmbed()
                    .setTitle('Incorrect usage :warning:')
                    .setColor("#ed0909")
                    .setDescription(`There was an error with the database, please contact Henryhre.`)
                    .setFooter(Index.footer)
                    .setTimestamp();
                      
                    message.channel.send({embeds: [embed]})
                    return;
                })
            }else{
                const embed = new Discord.MessageEmbed()
                .setTitle('Incorrect usage :warning:')
                .setColor("#ed0909")
                .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host${supportsPatrols ? ",patrol" : ""}> <Event name>\n${prefix}events <unset> <Event name>`)
                .setFooter(Index.footer)
                .setTimestamp();
                  
                message.channel.send({embeds: [embed]})
                return;
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}events\n${prefix}events <set> <attend,host${supportsPatrols ? ",patrol" : ""}> <Event name>\n${prefix}events <unset> <Event name>`)
            .setFooter(Index.footer)
            .setTimestamp();
              
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}