import dotenv from 'dotenv'
dotenv.config();
import {MongoClient, ObjectId} from 'mongodb';

class DataAccess{
    constructor(){
        this.MONGO_URI = process.env.MONGO_URL
        this.client = new MongoClient(this.MONGO_URI)
    }

    async connect(){
        try {
            await this.client.connect();
            console.log("Connected to DB")
        } catch (error){
            console.log(error)
        }
    }

    getDb(){
        return this.client.db("shop")
    }
}

const instance = new DataAccess()
export default instance