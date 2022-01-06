require('dotenv').config();

const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");

const allIntents = new Intents(32767);
const client = new Client({intents: [allIntents], fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

const rbx = require("noblox.js");

const DivisionHandler = require("./db/DivisionHandler");

const RbxAuditLogs = require("./utils/RbxAuditLogs");
const EventLogging = require("./utils/EventLogging");
const Reactionevent = require("./utils/reactionevent");
const RoleChange = require("./utils/rolechange");
const guildMemberRemove = require("./utils/guildMemberRemove");
const Inactivity = require("./utils/inactivity");

const fs = require('fs');

const footer = {text: "Created by Henryhre"};

client.commands = new Discord.Collection();
client.context_menus = new Discord.Collection();

const commandFiles = fs.readdirSync('./cmds/').filter(file => file.endsWith(".js"))
//const menuFiles = fs.readdirSync('./context-menu/').filter(file => file.endsWith(".js"))


for(file of commandFiles){
    const command = require(`./cmds/${file}`);
    client.commands.set(command.name, command);
}

client.login(process.env.TOKEN);


DivisionHandler.loadDivisions()


login().then(async ()=>{
    console.log("[RBLX] Logged in.")

    for(const division of DivisionHandler.getDBs()){
        if(await division.isConfigured() == true){
            const groupid = (await division.getConfig("Roblox-Group-Id")).Value;
            const robloxid = parseInt(groupid);
    
            const auditevent = rbx.onAuditLog(robloxid);
    
            auditevent.on("data", (data) =>{
                RbxAuditLogs.onAuditLog(data, client, division);
            })
    
            auditevent.on("error", function (err) {
            })
        }
    }
})

setInterval(() =>{
    for(const handler of DivisionHandler.getDBs()){
        console.log(`[INFO] Checked inactivity notices for ${handler.getDivisionName()} at ${new Date().toString()}`)
        Inactivity.checkINs(client, handler);
    }
}, 1000*60*60*2);



client.once('ready', async (ready) =>{
    console.log("[INFO] Discord Bot started.");

    const activities_list = [
        "The quota bot for all divisions!",
        "made by Henryhre",
        "for new event logs",
        "for new activity logs",
        "for new patrol logs"
    ];

    setInterval(() => {
        const index = Math.floor(Math.random() * activities_list.length); 
        client.user.setActivity(activities_list[index], {type: 'WATCHING'}); 
    }, 3000);

})


client.on('messageCreate', async (message) =>{
    if(message.guild == null) return;
    if(DivisionHandler.getDivisionDB(message.guild.id) == undefined) return;
    if(message.author.bot) return;

    const handler = DivisionHandler.getDivisionDB(message.guild.id);
    const prefix = await handler.getPrefix();

    const supportsPatrols = handler.supportsPatrols();

    if(message.channel.id == await handler.getChannel("activity-logs")){
        EventLogging.logAttendeeEvent(message, client, handler);
    }else if(message.channel.id == await handler.getChannel("event-logs")){
        EventLogging.logHostEvent(message, handler);
    }else if(supportsPatrols && message.channel.id == await handler.getChannel("patrol-logs")){
        EventLogging.logPatrol(message, client, handler);
    }else if(message.channel.id == await handler.getChannel("inactivity")){
        Inactivity.logInactivity(message, client, handler);
    }

    if(!message.content.startsWith(prefix)) return;
    if(message.member == undefined || message.member == null) return;

    const args = message.content.substring(prefix.length).split(" ");
    const command = args.shift().toLocaleLowerCase();

    if(command == "help"){
        client.commands.get("help").execute(message, args, handler);
    }else if(command == "points"){
        client.commands.get("points").execute(message, args, handler, client);
    }else if(command == "setup"){
        client.commands.get("setup").execute(message, args, handler, client, prefix);
    }else if(command == "alderaan"){
        client.commands.get("alderaan").execute(message, args, handler, rbx);
    }else if(command == "announce"){
        client.commands.get("announce").execute(message, args, client, handler);
    }else if(command == "ban"){
        client.commands.get("ban").execute(message, args, client, handler, rbx);
    }else if(command == "kick"){
        client.commands.get("kick").execute(message, args, client, handler, rbx);
    }else if(command == "check"){
        client.commands.get("check").execute(message, args, handler, rbx);
    }else if(command == "discharge"){
        client.commands.get("discharge").execute(message, args, client, handler, rbx);
    }else if(command == "filter"){
        client.commands.get("filter").execute(message, args, client, handler, rbx);
    }else if(command == "inactivity"){
        client.commands.get("inactivity").execute(message, args, client, handler);
    }else if(command == "info"){
        client.commands.get("info").execute(message, args, client, handler, rbx);
    }else if(command == "notice"){
        client.commands.get("notice").execute(message, args, handler, client, rbx);
    }else if(command == "purge"){
        client.commands.get("purge").execute(message, args, handler);
    }else if(command == "members"){
        client.commands.get("members").execute(message, args, handler);
    }else if(command == "top"){
        client.commands.get("top").execute(message, args, handler);
    }else if(command == "totalevents"){
        client.commands.get("totalevents").execute(message, args, handler);
    }else if(command == "quotafailures"){
        client.commands.get("quotafailures").execute(message, args, handler, client);
    }else if(command == "reload"){
        client.commands.get("reload").execute(message, args, handler, client);
    }else if(command == "change"){
        client.commands.get("change").execute(message, args, handler, client);
    }else if(command == "update"){
        client.commands.get("update").execute(message, args, handler);
    }else if(command == "resetpoints"){
        client.commands.get("resetpoints").execute(message, args, handler, client);
    }
})

client.on('messageReactionAdd', async (reaction, user) =>{
    if(DivisionHandler.getDivisionDB(reaction.message.guild.id) == undefined) return;
    const handler = DivisionHandler.getDivisionDB(reaction.message.guild.id);

    if(reaction.message.partial) await reaction.message.fetch();
    if(reaction.partial) await reaction.fetch();

    Reactionevent.messageReaction(client, user, handler, reaction, rbx)
})

client.on('guildMemberUpdate', (oldMember, newMember) =>{
    if(DivisionHandler.getDivisionDB(newMember.guild.id) == undefined) return;
    const handler = DivisionHandler.getDivisionDB(newMember.guild.id);

    RoleChange.roleChanged(oldMember, newMember, handler, client, rbx)
})

client.on("guildMemberRemove", (member) =>{
    if(DivisionHandler.getDivisionDB(member.guild.id) == undefined) return;
    const handler = DivisionHandler.getDivisionDB(member.guild.id);
    guildMemberRemove.run(member, handler, client, rbx);
})

async function login(){
    await rbx.setCookie(process.env.ROBLOX).catch(err => console.log(err)) 
}

module.exports.footer = footer;