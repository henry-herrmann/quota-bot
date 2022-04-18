const { connect, getConnection} = require("./Connector");
const DivisionDB = require("./DivisionDB");
const axios = require("axios");

const timer = ms => new Promise(res => setTimeout(res, ms))

const divisionDBs = [];

function loadDivisions(){
    return new Promise((resolve, reject) =>{
        console.log("[INFO] Loading all divisions, please wait...");
        connect().then(() =>{
            getConnection().query("SELECT * FROM quota.divisions", async (err, results, field) =>{
                for(result of results){
                    let db = new DivisionDB(result.name, result.id, result.patrols == 1 ? true : false, getConnection());
                    divisionDBs.push(db);
                    await createDB(result.name);
                }
                console.log("[INFO] All divisions loaded.");
                return resolve();
            })
        }).catch(err => {reject(err)});
    })
}

function getDivisionDB(id){
    return divisionDBs.find(div => div.getGuildID() == id);
}

function getDBs(){
    return divisionDBs;
}


async function getRobloxId(discordid){
    await timer(1000);
    return new Promise(async (resolve, reject) =>{
        axios({
            method: "GET",
            url: `https://v3.blox.link/developer/discord/${discordid}`,
            headers: {"api-key": process.env.BLOX_LINK_API_KEY}
        }).then(async (response) =>{
            if(response.status != 200 || response.data.user == null){
                return reject();
            }
            return resolve(response.data.user.robloxId);
        }).catch(async (err) =>{
            return reject(err);
        })
    })
}

function createDB(name){
    return new Promise((resolve, reject) =>{
        getConnection().query("CREATE DATABASE IF NOT EXISTS " + name, (err, result, fields) =>{
            if(err) reject(err);
            return resolve();
        });
    })
}

module.exports = {
    loadDivisions: loadDivisions,
    getDivisionDB: getDivisionDB,
    getDBs: getDBs,
    getRobloxId: getRobloxId
}