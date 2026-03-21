import { useState } from "react"

function App() {

  const[name, setName] = useState("")
  const[ms, setMs] = useState(0)
  const[arrivalTime, setArrivalTime] = useState(0)
  const[proceses, setProcesses] = useState([]) // List to save the processes
  const[quantum , setQuantum] = useState(0)
  const[completed, setCompleted] = useState([])

  function handleName(event){setName(event.target.value)}

  function handleMs(event){setMs(event.target.value)}

  function handleArrivalTime(event){setArrivalTime(event.target.value)}

  function handleSubmit(){

    const process = {
    Name : name,
    Ram_used : 30,
    Time_required: ms,  // Time needed to complete task 
    Time_left:ms,
    Completed: false,
    Arrival_time : arrivalTime,
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
    if(quantum <= 0 ){ // Si no ingresa quantum time 
      return
    }
    let currentTime = 0 // Trackea el tiempo que ha pasado 
    let queueCompleted = [] // La lista de los procesos completos
    const quantumEntered = quantum
    const queue = [...proceses] // Copiamos la lista a el queue para trabajar 
    while (queue.length > 0) {   // Mientras hayan en el queue
      let current = queue.shift()
      if(current.Time_left > quantum ){   // Si el tiempo es mayor al quantum hay otro ciclo aun, despues de este para el proceso 
        current.Time_left = Number(current.Time_left) - Number(quantumEntered)
        currentTime = Number(currentTime) + Number(quantum)
        queue.push(current) // Vuelve a la queue 
      }else{
        currentTime = Number(currentTime) + Number(current.Time_left)// In case a remaining of 2 when quantum is 3 or more 
        current.Completed = true
        current.Time_taken = Number(currentTime) - Number(current.ArrivalTime) // Tiempo que elapso desde el inicio hasta que se completo, - arrival por si llego luego 
        current.Wait_time = Number(current.Time_taken) - Number(current.Time_required) // Tiempo que estuvo idle
        queueCompleted.push(current)
      }
    }
    setCompleted(queueCompleted)
    setQuantum(0)
  }


  return (
    <>
      <h1>Simulacion Procesos - Robin Round </h1>
      <input value={name} type="text" onChange={handleName} placeholder="Nombre del Proceso" />
      <input value={ms} type="number" onChange={handleMs} placeholder="Tiempo en ms para realizar el proceso" />
      <input value={arrivalTime} type="number" onChange={handleArrivalTime} placeholder="Tiempo de llegada (0-)" />
      <button onClick={handleSubmit} >Submit</button>

      <ul>
        {proceses.map((proceso,index)=>{
          return(
            <li key={index}>Name: {proceso.Name} / Ram Usage : {proceso.Ram_used} / Time Required : {proceso.Time_required} / Arrival Time : {proceso.Arrival_time}</li>
          )
        })}
      </ul>

      <input type="number" value={quantum} onChange={handleQuantum} placeholder="Ingresa el tiempo del Quantum" />
      <button onClick={handleSimulation} > Simular </button>
      
      <ul>
        {completed.map((proceso,index)=>{
          return(
            <li key={index}>Name: {proceso.Name} / Time Taken : {proceso.Time_taken} / Wait Time (idle) : {proceso.Wait_time} / Time Required: {proceso.Time_required}</li>
          )
        })}
      </ul>
    </>
  )
}

export default App
