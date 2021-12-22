class DivisionDB {
    constructor(divisionname, guild_id, rsf, con){
        this.divisionname = divisionname;
        this.con = con;
        this.guild_id = guild_id;
        this.rsf = rsf;

        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.permission(id TEXT, level INT)`, (err, result, field) =>{
            if(err) console.log(err);
        })
        if(rsf) {
            con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.quota(Name TEXT, Attend INT, Host INT, Patrol INT, Joined TEXT, Staff INT(1))`, (err, result, field) =>{
                if(err) console.log(err);
            })
        }else{
            con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.quota(Name TEXT, Attend INT, Host INT, Joined TEXT, Staff INT(1))`, (err, result, field) =>{
                if(err) console.log(err);
            })
        }

        con.query(`CREATE TABLE IF NOT EXISTS ${divisionname}.inactivity(Name TEXT, id TEXT, StartDate TEXT, EndDate TEXT, Reason TEXT, MessageID TEXT)`, (err, result, field) =>{
            if(err) console.log(err);
        })
    }

    getDivisionName(){
        return this.divisionname;
    }
    
    getGuildID(){
        return this.guild_id;
    }

    getPermissionLevel(member) {
        return new Promise((resolve, reject) =>{
            let perms = [];

            this.con.query(`SELECT id FROM ${this.divisionname}.permission`, (err, result, fields) =>{
                if(err) reject(err);

                for(role of result){
                    if(member.roles.cache.some(r => r.id == role.id)){
                        perms.push(role.level);
                    }
                }
                return Math.max(...perms);
            })
        })
    }

    async addMember(name, member){
        return new Promise((resolve, reject) =>{
            const now = new Date().toLocaleString('en-US', {timeZone: 'America/New_York'})
            const date = new Date(now.toString())
            
            if(getPermissionLevel(member) < 1){
                if(this.rsf){
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Name, Attend, Host, Patrol, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?)`, [name, 0, 0, 0, date.toString(), "no"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }else{
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Name, Attend, Host, Joined, Staff) VALUES (?, ?, ?, ?, ?)`, [name, 0, 0, date.toString(), "no"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }
            }else{
                if(this.rsf){
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Name, Attend, Host, Patrol, Joined, Staff) VALUES (?, ?, ?, ?, ?, ?)`, [name, 0, 0, 0, date.toString(), "yes"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }else{
                    this.con.query(`INSERT INTO ${this.divisionname}.quota (Name, Attend, Host, Joined, Staff) VALUES (?, ?, ?, ?, ?)`, [name, 0, 0, date.toString(), "yes"], (err, result, field) =>{
                        if(err || result.insertId == undefined) reject(err);

                        return resolve();
                    })
                }
            }
        })
    }
}

module.exports = DivisionDB;