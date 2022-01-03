const Discord = require("discord.js");
const Index = require("../index");
const dateFormat = require("dateformat")

module.exports = {
    name: "alderaan",
    async execute(message, args, handler, rbx){
        if(args.length == 0){
            const placeinfo = await rbx.getPlaceInfo(5279830807);
            const instances = await rbx.getGameInstances(5279830807);

            var ping = 0;

            for(var i=0;i < instances.Collection.length;i++){
                ping = ping + instances.Collection[i].Ping;
                if(i == instances.Collection.length){
                    ping = ping / instances.Collection.length;
                }
            }


            const embed = new Discord.MessageEmbed()
            .setTitle("Alderaan Information")
            .setColor("#3d87f5")
            .setThumbnail("https://t3.rbxcdn.com/0ef472481852269eaaefec493816c865")
            .addField("Online players:", `**${placeinfo.OnlineCount.toString()}**`, true)
            .addField("Is playable?:", placeinfo.IsPlayable == true ? "Yes" : "No", true)
            .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
            .addField("Upvotes:", placeinfo.TotalUpVotes.toString(), true)
            .addField("Downvotes:", placeinfo.TotalDownVotes.toString(), true)
            .addField("Last updated:", dateFormat(placeinfo.Updated, "m/d/yy"), true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${await handler.getPrefix()}alderaan`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}