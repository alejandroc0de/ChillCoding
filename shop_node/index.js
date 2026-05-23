import readline from 'readline';
import db from './db.js'
import {getAll, getByCat, getPCat} from './services/productoService.js'
import {hacerCompra} from './services/carritoService.js'
import { loginDb, registerDb } from './services/usuarioService.js';
import { setTimeout } from 'timers/promises';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let carrito = []

function preguntar(mensaje){
    return new Promise((resolve) => {
        rl.question(mensaje, (respuesta) => {
            resolve(respuesta)
        })
    })
}

async function main() {
    await db.connect()
    while (true){
        console.log("\nBienvenido a la tienda\n")
        carrito = []
        const path = await preguntar("1. Iniciar Sesion \n2. Registrarse\n")
        const seRegistro = await handleuser(path)
        while(seRegistro){
            const pathInventory = await preguntar ("1. Ver Inventario \n2. Buscar por categorias\n")
            switch(pathInventory){
                case "1" :
                    await comprarItems()
                    break
                case "2":
                    await buscarCategorias()
                    break
            }
        }
    }
    
}

async function comprarItems(){
    console.log("\n--- Productos disponibles ---")
    const productos = await getAll()
    productos.forEach((p,i)=> {
        console.log(`${i+1}. ${p.nombre}. ${p.precio}$. ${p.stock} left`)
    })
    const producto = await preguntar("\nQue producto quiere añadir?\n")
    const cantidad = await preguntar("Cuantas unidades?\n")
    if(cantidad>productos[producto-1].stock){
        console.log("Ingresaste mas cantidad que el stock")
        return
    }
    carrito.push({producto : productos[producto-1],cantidad: cantidad})
    const nextStep = await preguntar ("\nIngrese una opcion: \n1.Seguir Comprando \n2.Ir al carrito\n")
    switch(nextStep){
        case "1" :
            await comprarItems()
            break
        case "2" :
            await irCarrito()
            break
    }
}

async function irCarrito() {
    console.log("\n\nResumen del carro")
    let total = 0
    carrito.forEach((p,i)=> {
        if (p.cantidad>1){
            total += p.cantidad * p.producto.precio
        }else{
            total += p.producto.precio
        }
        console.log(`Producto: ${p.producto.nombre} - Precio: ${p.producto.precio}`)
    })
    console.log("\nTotal compra: ", total)
    const enter = await preguntar("Presione enter para comprar... ")
    if(enter == ""){
        console.log("Procesando...") 
        await setTimeout(2000)
        await realizarCompra(carrito)
        
    }else{
        console.log("Compra cancelada... Volviendo al menu")
        await setTimeout(1000)
        comprarItems()
    }
}



async function realizarCompra(carrito) {
    const result = await hacerCompra(carrito)
    if(result.modifiedCount>0){
        console.log("Compre exitosa. Disfruta tus productos!")
        carrito = []
        await setTimeout(3000)
    }else{
        console.log("Hubo un error al realizar al compra, contacta soporte")
        await setTimeout(1000)
    }
}


async function login() {
    const username = await preguntar("\nIngresa tu nombre de usuario\n")
    const password = await preguntar("\nIngresa tu contraseña\n")
    return await loginDb(username,password)
}

async function register() {
    const username = await preguntar("\nIngresa un username\n")
    const password = await preguntar("\nIngresa una contraseña\n")
    const result = await registerDb(username,password)
}

async function handleuser(opcion){
    switch (opcion){
        case "1":
            let resultLogin = false
            while(!resultLogin){
                resultLogin = await login()
            }
            return true
            break;
        case "2":
            await register()
            break;
    }
}

async function buscarCategorias() {
    const categorias = await getByCat()
    console.log("------ Categorias Disponibles ------")
    categorias.map((categoria,i) => {
        console.log(`${i+1}. ${categoria}`)
    })
    const categoriaEscogida = await preguntar("¿Escoge una categoria?\n")
    const categoriaString = categorias[categoriaEscogida-1]
    const productos = await getPCat(categoriaString)
    console.log("\n\n\n-- Mostrando todos los productos de ", categoriaString, "--")
    productos.forEach((p,i)=> {
        console.log(`${i+1}. ${p.nombre}. ${p.precio}$. ${p.stock} left`)
    })
    const producto = await preguntar("\nQue producto quiere añadir?\n")
    const cantidad = await preguntar("Cuantas unidades?\n")
    if(cantidad>productos[producto-1].stock){
        console.log("Ingresaste mas cantidad que el stock")
        return
    }
    carrito.push({producto : productos[producto-1],cantidad: cantidad})
    const nextStep = await preguntar ("\nIngrese una opcion: \n1.Seguir Comprando \n2.Ir al carrito\n")
    switch(nextStep){
        case "1" :
            await comprarItems()
            break
        case "2" :
            await irCarrito()
            break
    }
}

main()