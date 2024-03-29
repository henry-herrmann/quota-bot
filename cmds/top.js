const Discord = require('discord.js');
const Index = require('../index');

module.exports = {
    name: "top",
    async execute(message, args, handler){
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
        const supportsPatrols = handler.supportsPatrols();

        if(args.length == 0){
            handler.getMembers().then(async(doc) =>{
                var personnel = [];
                new Promise(async (resolve, reject) =>{

                    for(const member of doc){
                        if(supportsPatrols){
                            var attendpoints = member.Attend;
                            var patrolpoints = member.Patrol;
                            var hostpoints = member.Host;
        
                            var sum = parseFloat(attendpoints) + parseFloat(patrolpoints) + parseFloat(hostpoints);
                            const user = {
                                Id: member.Id,
                                Sum: sum
                            }
                            personnel.push(user)
                        }else{
                            var attendpoints = member.Attend;
                            var hostpoints = member.Host;
        
                            var sum = parseFloat(attendpoints) + parseFloat(hostpoints);
                            const user = {
                                Id: member.Id,
                                Sum: sum
                            }
                            personnel.push(user)
                        }
                        
                    }
                    resolve();
                }).then(() =>{
                    const top = personnel.sort((a, b) =>{
                        return b.Sum - a.Sum;
                    }).slice(0, 5);

                    var arr = [];

                    for(e of top){
                        arr.push(`- <@${e.Id}>: ${e.Sum}`)
                        
                    }

                    const embed = new Discord.MessageEmbed()
                    .setTitle("Top 5 Earners :moneybag:")
                    .setColor("#FFD700")
                    .setDescription(arr.join("\n"))
                    .setFooter(Index.footer)
                    .setTimestamp();

                    message.channel.send({embeds: [embed]})
                })
            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}top`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}