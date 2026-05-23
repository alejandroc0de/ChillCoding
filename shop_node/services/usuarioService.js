import console from 'console'
import db from '../db.js'

async function loginDb(username, password) {
    const data = await db.getDb().collection("usuarios").find({username:username}).toArray()
    if (data.length>0){
        if(data[0].password == password){
            return true
        }else{
            return false
        }
    }else{
        console.log("Info incorrecta")
        return false;
    }
}


async function registerDb (username, password) {
    return await db.getDb().collection("usuarios").insertOne({username: username, password:password})
}
export {loginDb, registerDb}