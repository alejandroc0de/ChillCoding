import { MongoClient} from 'mongodb';
import dotenv from 'dotenv'
dotenv.config();


class DataAccess{
  constructor(){
    this.MONGO_URL = process.env.MONGO_URL
    this.client = new MongoClient(this.MONGO_URL)
  }


  async connect(){
    try {
        await this.client.connect();
        console.log("Conection Succesfull MongoDB")
    } catch (error) {
      console.log(error)
    }  
  }

  async findAll(collection){
    try {
      return await this.client.db().collection(collection).find().toArray()
    } catch (error) {
      console.log(error)
    }
  }

  async insertOne (collection,data) {
    try {
      await this.client.db().collection(collection).insertOne(data);
    } catch (error) {
      console.log(error)
    }
  }


  close(){
    this.client.close();
  }
}


export default DataAccess