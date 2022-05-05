const Discord = require("discord.js");
const Index = require("../index");

class PageEmbed {
    constructor(title, color, pages = []){
        this.title = title;
        this.color = color;
        this.pages = pages;
        this.currentIndex = 0;
    }

    getPages(){
        return this.pages;
    }

    getPage(index){
        return this.pages[index];
    }

    setPages(bulkArray){
        this.pages = bulkArray;
        this.currentIndex = 0;
    }

    nextPage(){
        if(this.currentIndex < this.pages.length-1){
            this.currentIndex++;
        }
    }

    previousPage(){
        if(this.currentIndex != 0 || this.currentIndex == this.pages.length-1){
            this.currentIndex--;
        }
    }

    getCurrentIndex(){
        return this.currentIndex;
    }

    getLength(){
        return this.pages.length;
    }

    getCurrentPageEmbed(){
        const embed = new Discord.MessageEmbed()
        .setTitle(`${this.title} - Page ${this.currentIndex + 1}`)
        .setColor(this.color)
        .setDescription(this.pages[this.currentIndex])
        .setFooter(Index.footer)
        .setTimestamp();

        return embed;
    }

}

module.exports = PageEmbed;