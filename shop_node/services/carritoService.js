import db from '../db.js'
import { ObjectId } from 'mongodb'

async function hacerCompra(carrito) {
    const operations = carrito.map(item => ({
        updateOne : { filter: {_id: new ObjectId(item.producto._id)}, update: {$inc:{stock : -item.cantidad}}}
    }))
    const result = await db.getDb().collection("productos").bulkWrite(operations)
    return result
}

export {hacerCompra}