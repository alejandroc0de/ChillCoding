import DataAccess from "../db.js";

const dataAccess = new DataAccess();
const collection = "autor"

dataAccess.connect();

async function findAll(){
    console.log(await dataAccess.findAll("autor"));
    dataAccess.close();
} 

async function insertOne(){
    const data = {
        nombre: "Jhon",
        apellido: "Mendez",
        nacionalidad : "Colombia"
    }
    await dataAccess.insertOne(collection,data)
    dataAccess.close();
} 

insertOne()
findAll()
