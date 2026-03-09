const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



app.get('/path', (req,res) => {
    const urlGiven = req.query.id
    const timeSent = req.query.timeSent
    const timeNow = Date.now()
    const timeNow2 = new Date(timeNow)
    console.log("Request made at " + timeNow2)
    const datee = new Date(Number(timeSent)) 
    console.log("Sent at : " + datee)

    if(timeNow-Number(timeSent) < 30000){
        console.log("This is probably the Imessage server")
    }else{
        console.log("A human probably hit the server")
    }
    getInfo()

    res.redirect(`https://open.spotify.com/track/${urlGiven}`)
})


async function getInfo(){
    const response = await axios.get('https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC')
    $('meta[property="og:title"]').attr('content')
    console.log(response)
}




app.listen(3000, ()=>{
    console.log("Server runningggg ")
})
