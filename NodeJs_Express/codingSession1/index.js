const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()



app.get('/path', async (req,res) => {
    const urlGiven = req.query.id
    const timeSent = req.query.timeSent

    const timeNow = Date.now()
    const timeNow2 = new Date(timeNow)
    console.log("Request made at " + timeNow2)
    const datee = new Date(Number(timeSent)) 
    console.log("Sent at : " + datee)

    if(timeNow-Number(timeSent) < 30000){
        console.log("This is probably the Imessage server")
        const info = await getInfo(urlGiven)
        res.send(`
            <html>
                <head>
                    <meta property="og:title" content="${info.title}">
                    <meta property="og:description" content="${info.desc}">
                    <meta property="og:image" content="${info.img}">
                    <meta property="og:url" content="${info.url}">
                </head>
            </html>
        `)
    }else{
        console.log("A human probably hit the server")
        res.redirect(`https://music.apple.com/us/song/i-knew-it-i-know-you/1773474473`)
    }
    
})

async function getInfo(urlGiven){
    const response = await axios.get(`https://music.apple.com/us/song/i-knew-it-i-know-you/1773474473`)
    const $ = cheerio.load(response.data) 
    const title = $('meta[property="og:title"]').attr('content')
    const desc = $('meta[property="og:description"]').attr('content')
    const img = $('meta[property="og:image"]').attr('content')
    const url = $('meta[property="og:url"]').attr('content')
    return {
        title,
        desc,
        img,
        url
    }
}


app.listen(3000, ()=>{
    console.log("Server runningggg ")
})


// https://music.apple.com/us/song/i-knew-it-i-know-you/1773474473