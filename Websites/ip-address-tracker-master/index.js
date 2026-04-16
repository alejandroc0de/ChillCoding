const ip_input = document.getElementById("ip-address")
const button = document.getElementById("submitButton")


const map = L.map('map').setView([4.7, -74.0], 5);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


button.addEventListener("click", async (event) => {
    const ip = ip_input.value
    try {
        const res = await fetch (`https://geo.ipify.org/api/v2/country,city?apiKey=at_JzI5TCYLHi7Vs1Ft36eSHBwgEADSO&ipAddress=${ip}`)
        const data = await res.json()
        console.log(data)
        document.getElementById("ip").textContent = data.ip
        document.getElementById("location").textContent = `${data.location.city}, ${data.location.region}`
        document.getElementById("timezone").textContent = `UTC : ${data.location.timezone}`
        document.getElementById("isp").textContent = data.isp
        map.setView([data.location.lat, data.location.lng],10)
        var marker = L.marker([data.location.lat, data.location.lng]).addTo(map);
    } catch (error) {
        console.log(error)
    }
    
})

