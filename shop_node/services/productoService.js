import db from '../db.js'

async function getAll() {
    return await db.getDb().collection("productos").find({}, { projection: { nombre: 1, precio: 1, stock: 1, categoria: 1, _id: 1 }}).toArray()
}

async function getByCat() {
    return await db.getDb().collection("productos").distinct("categoria")
}

async function getPCat(categoria) {
    return await db.getDb().collection("productos").find({categoria: categoria}).toArray()
}

export {getAll,getByCat,getPCat}