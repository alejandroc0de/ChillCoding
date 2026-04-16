const ip_input = document.getElementById("ip-address")
const button = document.getElementById("submitButton")


const map = L.map('map').setView([4.7, -74.0], 5); // Seteo la vista a colombia, y el nivel del zoom 

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' // Traigo el layout del mapa que voy a usar
}).addTo(map);


button.addEventListener("click", async (event) => {
    const ip = ip_input.value
    try {
        const res = await fetch (`https://geo.ipify.org/api/v2/country,city?apiKey=at_JzI5TCYLHi7Vs1Ft36eSHBwgEADSO&ipAddress=${ip}`) // llamar la API
        const data = await res.json() // Transformar los datos a JSON
        // Se usa innerHTML, para poder pasarle spans en vez de text content que solo permitiria <p></p>
        document.getElementById("ip").innerHTML = `<span class="label">IP ADDRESS</span> <span class="value">${data.ip}`
        document.getElementById("location").innerHTML = `<span class="label">LOCATION</span> <span class="value">${data.location.city}, ${data.location.region}</span>`
        document.getElementById("timezone").innerHTML = ` <span class="label">TIMEZONE</span> <span class="value"> UTC ${data.location.timezone}</span>`
        document.getElementById("isp").innerHTML = `<span class="label">ISP</span> <span class="value">${data.isp}`
        document.getElementById("results").classList.remove("hidden") // Responsive, una vez que si hay resultados se muestra el banner con los resultados
        document.getElementById("results").classList.add("show")
        map.setView([data.location.lat, data.location.lng],15) // Seteo el view del mapa con las cordenadas de la ip dada, y un zoom mas grande 
        var marker = L.marker([data.location.lat, data.location.lng]).addTo(map); // Añado el marker al mapa con la ubicacion de la ip 
    } catch (error) {
        console.log(error)
    }
    
})

