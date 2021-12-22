require('dotenv').config();

const Discord = require("discord.js");
const { Client, Intents } = require("discord.js");

const allIntents = new Intents(32767);

const client = new Client({intents: [allIntents], fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION']});

const DivisionHandler = require("./db/DivisionHandler");

DivisionHandler.loadDivisions();