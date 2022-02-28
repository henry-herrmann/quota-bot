const Discord = require('discord.js');
const Index = require('../index');

module.exports = {
    name: "announce",
    async execute(message, args, client, handler){  
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
        
        const permlvl = parseInt((await handler.getConfig("Filter-Permission-Level")).Value);

        if(await  handler.getPermissionLevel(message.member) < permlvl){
            const embed = new Discord.MessageEmbed()
            .setTitle('Insufficient permissions :warning:')
            .setColor("#ed0909")
            .setDescription(`You are missing the required permissions to execute this command.`)
            .setFooter(Index.footer)
            .setTimestamp();
            message.channel.send({embeds: [embed]})
            return;
        }

        if(parseInt((await handler.getConfig("Announce-Members")).Value) == 0){
            const embed = new Discord.MessageEmbed()
            .setTitle('Announcing new members disabled :warning:')
            .setColor("#ed0909")
            .setDescription(`This feature was disabled by divisional HiCom. Please ask your CO to re-enable it.`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return;
        }
        if(args.length == 0){
            if(handler.filteredplayers.length == 0){
                const embed = new Discord.MessageEmbed()
                .setTitle('Error :warning:')
                .setColor("#ed0909")
                .setDescription(`There are no players to announce.`)
                .setFooter(Index.footer)
                .setTimestamp();
  
                message.channel.send({embeds: [embed]})
                return;
            }

            let welcome_message = (await handler.getConfig("Welcome-Message")).Value;

            var string = "";
            new Promise((resolve, reject) =>{
                for(var i=0; i< handler.filteredplayers.length; i++){
                    var id = handler.filteredplayers[i];
    
                    if(i==0){
                        string = `<@${id}>`;
                    }else{
                        string = string + `, <@${id}>`;
                    }
                }
                resolve();
            }).then(async ()=>{
                handler.filteredplayers = [];

                const users = welcome_message.replace(/{users}/gi, string);

                if(users != undefined && users != null && users != ""){
                    welcome_message = users;
                }

                const div_name = welcome_message.replace(/{div-name}/gi, (await handler.getConfig("Division-Name")).Value);

                if(div_name != undefined && div_name != null && div_name != ""){
                    welcome_message = div_name;
                }

                client.channels.cache.get((await handler.getConfig("Announce-channel")).Value).send(`<@&${(await handler.getConfig("Personnel-Id")).Value}> ${welcome_message}`);
            })
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${prefix}announce`)
            .setFooter(Index.footer)
            .setTimestamp();
              
            message.channel.send({embeds: [embed]})
            return;
        }
    }
}