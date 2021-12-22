const { connect, getConnection} = require("./Connector");
const DivisionDB = require("./DivisionDB");

const divisionDBs = [];

function loadDivisions(){
    console.log("[INFO] Loading all divisions, please wait...");

    connect().then(() =>{
        getConnection().query("SELECT * FROM quota.divisions", async (err, results, field) =>{
            for(result of results){
                let db = new DivisionDB(result.name, result.id, result.rsf == 1 ? true : false, getConnection());
                divisionDBs.push(db);
                await createDB(result.name);
            }
        })
    }).catch(err => {console.log(err)});
}

function getDivisionDB(id){
    return divisionDBs.find(div => div.getGuildID() == id);
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
    divisionDBs: divisionDBs
}