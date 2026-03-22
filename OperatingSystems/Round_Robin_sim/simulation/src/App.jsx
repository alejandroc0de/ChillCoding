import { use, useState } from "react"
import './index.css'

function App() {

  const[name, setName] = useState("")
  const[ms, setMs] = useState(0)
  const[arrivalTime, setArrivalTime] = useState(0)
  const[proceses, setProcesses] = useState([]) // List to save the processes
  const[quantum , setQuantum] = useState(0)
  const[completed, setCompleted] = useState([])
  const[gant, setGant] = useState([])
  const[porcentajeUsage, setPorcentajeUsage] = useState(0)

  function handleName(event){setName(event.target.value)}

  function handleMs(event){setMs(event.target.value)}

  function handleArrivalTime(event){setArrivalTime(event.target.value)}

  function handleSubmit(){

    const process = {
    Name : name,
    Ram_used : 30,
    Time_required: Number(ms),  // Time needed to complete task 
    Time_left:Number(ms),
    Completed: false,
    Arrival_time : Number(arrivalTime),
    Time_taken: 0, // En completar proceso
    Wait_time: 0 // Tiempo en espera idle 
    }
    setProcesses([...proceses, process])
    setName("")
    setMs(0)
    // Here i save the process object to the array once submited
  }


  function handleQuantum(event){
    setQuantum(event.target.value)
  }

  function handleSimulation(){
    let arrayGraphic = []
    if(quantum <= 0 ){ // Si no ingresa quantum time 
      return
    }
    let currentTime = 0 // Trackea el tiempo que ha pasado 
    let queueCompleted = [] // La lista de los procesos completos
    const quantumEntered = Number(quantum)
    const queue = [...proceses] // Copiamos la lista a el queue para trabajar 


    while (queue.length > 0) {   // Mientras hayan en el queue
      let current = queue.shift()
      if(current.Time_left > quantum ){   // Si el tiempo es mayor al quantum hay otro ciclo aun, despues de este para el proceso 
        arrayGraphic.push({
          name : current.Name,
          start : currentTime,
          end : Number(currentTime) + Number(quantum)
        })

        current.Time_left = Number(current.Time_left) - Number(quantumEntered)
        currentTime = Number(currentTime) + quantumEntered

        queue.push(current) // Vuelve a la queue 
      }else{
        arrayGraphic.push({
          name : current.Name,
          start : currentTime,
          end : Number(currentTime) + Number(current.Time_left)
        })
        currentTime = Number(currentTime) + Number(current.Time_left)// In case a remaining of 2 when quantum is 3 or more 
        current.Completed = true
        current.Time_taken = Number(currentTime) - Number(current.Arrival_time) // Tiempo que elapso desde el inicio hasta que se completo, - arrival por si llego luego 
        current.Wait_time = Number(current.Time_taken) - Number(current.Time_required) // Tiempo que estuvo idle
        queueCompleted.push(current)
      }

    }
    const cpuUsage = (arrayGraphic.reduce((acumulado,bloque) => {
      return acumulado + (bloque.end-bloque.start) // Toma cada bloque del gant y suma los tiempos de uso
    },0)) // Empieza en 0 
    setPorcentajeUsage((cpuUsage / currentTime )* 100)


    setGant(arrayGraphic)
    setCompleted(queueCompleted)
    setQuantum(0)

  }
  const totalTime = gant.length > 0 ? gant[gant.length-1].end : 0 // SI hay gant data take it, otherwise 0 
  const colors = ["bg-amber-500", "bg-blue-500", "bg-green-500", "bg-red-500", "bg-purple-500"]

  return (
    <>
    <div className="flex flex-col text-center bg-gray-200 m-5 gap-3 p-5 items-center">

      <h1 className="font-extrabold text-6xl text-center" >Simulacion Procesos - Robin Round </h1>
      <input className="bg-gray-400 rounded-2xl p-3" value={name} type="text" onChange={handleName} placeholder="Nombre del Proceso" />
      <label htmlFor="">Time to take (ms) </label>
      <input className="bg-gray-400 rounded-2xl p-3" value={ms} type="number" onChange={handleMs} placeholder="Time in ms" />
      <label htmlFor="">Arrival time (ms) </label>
      <input className="bg-gray-400 rounded-2xl p-3" value={arrivalTime} type="number" onChange={handleArrivalTime} placeholder="Time of arrival (0-)" />
      <button className="bg-green-300 p-4 rounded-2xl shadow-2xl font-bold" onClick={handleSubmit} >Submit </button>

      <ul className="" >
        {proceses.map((proceso,index)=>{
          return(
            <li className="bg-white rounded-lg p-3 mb-2" key={index}>Name: {proceso.Name} / Ram Usage : {proceso.Ram_used} / Time Required : {proceso.Time_required} / Arrival Time : {proceso.Arrival_time}</li>
          )
        })}
      </ul>

      <input className="bg-gray-400 rounded-2xl p-3" type="number" value={quantum} onChange={handleQuantum} placeholder="Quantum" />
      <button className="rounded-2xl bg-green-300 p-4 shadow-2xl font-bold" onClick={handleSimulation} > Simulate </button>
      
      <ul className="mb-3">
        {completed.map((proceso,index)=>{
          return(
            <li className="bg-white rounded-lg p-3 mb-2" key={index}>Name: {proceso.Name} / Time Taken : {proceso.Time_taken} / Wait Time (idle) : {proceso.Wait_time} / Time Required: {proceso.Time_required}</li>
          )
        })}
      </ul>
    </div>
    <div className="m-5 p-5">
      <label htmlFor="">Usage of the CPU : {porcentajeUsage} % </label>
      <div className="h-20 text-center border-2 flex w-full">
        {gant.map((procesoGant, index)=>{
          const start = procesoGant.start
          const end = procesoGant.end
          const porcentaje = ((end - start) / totalTime)*100
          console.log(porcentaje,"%")
          const indexColor = proceses.findIndex(objeto => objeto.Name === procesoGant.name) // compáro el name del obj de la lista de procceses, con el nombre del proceso que vamos a dibujar
          return(
            <div key={index} style={{ width: `${porcentaje}%`}} className={colors[indexColor]} >{procesoGant.name}: {start}ms-{end}ms</div>
          )
        })}
      </div>
      
    </div>
    </>
  )
}

export default App
