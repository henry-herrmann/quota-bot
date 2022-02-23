const Discord = require("discord.js");
const Index = require("../index");
const dateFormat = require("dateformat")
const axios = require("axios");

module.exports = {
    name: "game",
    async execute(message, args, handler, rbx){
        if(args.length == 0){
            const placeinfo = await rbx.getUniverseInfo(532977776);
            const instances = await rbx.getGameInstances(1322647007);

            var ping = 0;

            for(var i=0;i < instances.Collection.length;i++){
                ping = ping + instances.Collection[i].Ping;
                if(i == instances.Collection.length){
                    ping = ping / instances.Collection.length;
                }
            }

            const votes = await getVotes(532977776).catch(err =>{
                console.log(err);
            })


            const embed = new Discord.MessageEmbed()
            .setTitle("1313 Information")
            .setColor("#ba7806")
            .setThumbnail("https://t2.rbxcdn.com/db4a36d1c6653f6b46e364cd4fd80c85")
            .addField("Online players:", `**${placeinfo[0].playing.toString()}**`, true)
            .addField("Created on:", dateFormat(placeinfo[0].created, "m/d/yy"), true)
            .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
            .addField("Upvotes:", votes.upVotes.toString(), true)
            .addField("Downvotes:", votes.downVotes.toString(), true)
            .addField("Last updated:", dateFormat(placeinfo[0].Updated, "m/d/yy"), true)
            .setFooter(Index.footer)
            .setTimestamp();

            message.channel.send({embeds: [embed]})
        }else if(args.length == 1){
            if(args[0].toLowerCase() == "1313"){
                const placeinfo = await rbx.getUniverseInfo(532977776);
                const instances = await rbx.getGameInstances(1322647007);
    
                var ping = 0;
    
                for(var i=0;i < instances.Collection.length;i++){
                    ping = ping + instances.Collection[i].Ping;
                    if(i == instances.Collection.length){
                        ping = ping / instances.Collection.length;
                    }
                }
    
                const votes = await getVotes(532977776).catch(err =>{
                    console.log(err);
                })
    
    
                const embed = new Discord.MessageEmbed()
                .setTitle("1313 Information")
                .setColor("#ba7806")
                .setThumbnail("https://t2.rbxcdn.com/db4a36d1c6653f6b46e364cd4fd80c85")
                .addField("Online players:", `**${placeinfo[0].playing.toString()}**`, true)
                .addField("Created on:", dateFormat(placeinfo[0].created, "m/d/yy"), true)
                .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
                .addField("Upvotes:", votes.upVotes.toString(), true)
                .addField("Downvotes:", votes.downVotes.toString(), true)
                .addField("Last updated:", dateFormat(placeinfo[0].Updated, "m/d/yy"), true)
                .setFooter(Index.footer)
                .setTimestamp();
    
                message.channel.send({embeds: [embed]})
            }else if(args[0].toLowerCase() == "alderaan"){
                const placeinfo = await rbx.getUniverseInfo(1849111980);
                const instances = await rbx.getGameInstances(5279830807);
    
                var ping = 0;
    
                for(var i=0;i < instances.Collection.length;i++){
                    ping = ping + instances.Collection[i].Ping;
                    if(i == instances.Collection.length){
                        ping = ping / instances.Collection.length;
                    }
                }
    
                const votes = await getVotes(1849111980).catch(err =>{
                    console.log(err);
                })
    
    
                const embed = new Discord.MessageEmbed()
                .setTitle("Alderaan Information")
                .setColor("#3d87f5")
                .setThumbnail("https://t7.rbxcdn.com/c2f16f3cedc9216c83935b1640e33a31")
                .addField("Online players:", `**${placeinfo[0].playing.toString()}**`, true)
                .addField("Created on:", dateFormat(placeinfo[0].created, "m/d/yy"), true)
                .addField("Ping:", ping == 0 ? "No servers online." : ping.toString(), true)
                .addField("Upvotes:", votes.upVotes.toString(), true)
                .addField("Downvotes:", votes.downVotes.toString(), true)
                .addField("Last updated:", dateFormat(placeinfo[0].Updated, "m/d/yy"), true)
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

function getVotes(universeId){
    return new Promise((resolve, reject) =>{
        axios.get("https://games.roblox.com/v1/games/votes?universeIds=532977776").then((response) =>{
            if(response == undefined || response == null || response.data == undefined){
                return reject();
            }

            const votes = {
                upVotes: response.data.data[0].upVotes,
                downVotes: response.data.data[0].downVotes
            };

            return resolve(votes);
        }).catch((err) =>{
            return reject(err);
        })
    })
}