const mysql = require("mysql");

let con; 

const getConnection = () => { return con; }

const isConnected = () => { return con != undefined; }

const connect = () =>{
    return new Promise((resolve, reject) =>{
        if(isConnected()) reject("Already connected to the database.");

        console.log("[INFO] Connecting to the database, please wait...");

        con = mysql.createPool({
            host: process.env.DB_IP,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        })

        console.log("[INFO] Connected to the database.")

        return resolve();
    })
}

const disconnect = () =>{
    return new Promise((resolve, reject) =>{
        if(!isConnected()) reject("Not connected");
        con.end();
        return resolve;
    })
}

module.exports = {
    getConnection: getConnection,
    isConnected: isConnected,
    connect: connect,
    disconnect: disconnect,
}