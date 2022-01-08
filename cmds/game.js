const Discord = require("discord.js");
const Index = require("../index");
const dateFormat = require("dateformat")

module.exports = {
    name: "game",
    async execute(message, args, handler, rbx){
        if(args.length == 0){
            const placeinfo = await rbx.getPlaceInfo(1322647007);
            const instances = await rbx.getGameInstances(1322647007);

            var ping = 0;

            for(var i=0;i < instances.Collection.length;i++){
                ping = ping + instances.Collection[i].Ping;
                if(i == instances.Collection.length){
                    ping = ping / instances.Collection.length;
                }
            }


            const embed = new Discord.MessageEmbed()
            .setTitle("1313 Information")
            .setColor("#ba7806")
            .setThumbnail("https://t2.rbxcdn.com/db4a36d1c6653f6b46e364cd4fd80c85")
            .addField("Online players:", `**${placeinfo.OnlineCount.toString()}**`, true)
            .addField("Is playable?:", placeinfo.IsPlayable == true ? "Yes" : "No", true)
            .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
            .addField("Upvotes:", placeinfo.TotalUpVotes.toString(), true)
            .addField("Downvotes:", placeinfo.TotalDownVotes.toString(), true)
            .addField("Last updated:", dateFormat(placeinfo.Updated, "m/d/yy"), true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            
        }else if(args.length == 1){
            if(args[0].toLowerCase() == "1313"){
                const placeinfo = await rbx.getPlaceInfo(1322647007);
                const instances = await rbx.getGameInstances(1322647007);
    
                var ping = 0;
    
                for(var i=0;i < instances.Collection.length;i++){
                    ping = ping + instances.Collection[i].Ping;
                    if(i == instances.Collection.length){
                        ping = ping / instances.Collection.length;
                    }
                }
    
    
                const embed = new Discord.MessageEmbed()
                .setTitle("1313 Information")
                .setColor("#ba7806")
                .setThumbnail("https://t2.rbxcdn.com/db4a36d1c6653f6b46e364cd4fd80c85")
                .addField("Online players:", `**${placeinfo.OnlineCount.toString()}**`, true)
                .addField("Is playable?:", placeinfo.IsPlayable == true ? "Yes" : "No", true)
                .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
                .addField("Upvotes:", placeinfo.TotalUpVotes.toString(), true)
                .addField("Downvotes:", placeinfo.TotalDownVotes.toString(), true)
                .addField("Last updated:", dateFormat(placeinfo.Updated, "m/d/yy"), true)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
            }else if(args[0].toLowerCase() == "alderaan"){
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
                .setThumbnail("https://t7.rbxcdn.com/c2f16f3cedc9216c83935b1640e33a31")
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
                .setDescription(`>>> ${await handler.getPrefix()}game (<1313, alderaan>)`)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
                return; 
            }
        }else{
            const embed = new Discord.MessageEmbed()
            .setTitle('Incorrect usage :warning:')
            .setColor("#ed0909")
            .setDescription(`>>> ${await handler.getPrefix()}game (<1313, alderaan>)`)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
            return; 
        }
    }
}