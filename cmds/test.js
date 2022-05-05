const Discord = require("discord.js");
const Index = require("../index");
const PageEmbed = require("../utils/PageEmbed");
const PageEmbedHandler = require("../utils/PageEmbedHandler");

module.exports = {
    name: "test",
    async execute(message, args, client){
        const pages = [
            "This is a test",
            "This is not a test",
            "This is test 2"
        ]

        const pageEmbed = new PageEmbed("Test Embed", "#ed0909", pages);

        const msg = await message.channel.send({embeds: [pageEmbed.getCurrentPageEmbed()]});

        PageEmbedHandler.addEmbed(pageEmbed, msg.id);

        if(pageEmbed.getLength()-1 > 0 ){
            msg.react("➡️");
        }

    }
}