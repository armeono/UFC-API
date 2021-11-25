const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const PORT = process.env.PORT || 8000

const app = express()

const url = 'https://www.ufc.com/rankings'

const baseURL = 'https://www.ufc.com'



app.get('/', (req, res) => {
    res.json('Welcome to my UFC API!')
})

function wordToUpper(str) { 

   return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

}

app.get('/:division', (req, res) => {



    let division = req.params.division

    division = division.replace('-', ' ')

    division = wordToUpper(division)

    axios.get(url).then(response => {

        const html = response.data

        const $ = cheerio.load(html)

        const fighters = []

        $(`.view-grouping:contains("${division}")`, html).each(function (index, element) {

            pos = 0

           $(element).find('div a')
           .each(function(index, element) {   

            fighters.push({
                name: $(element).text(),
                position: pos,
                url: baseURL + $(element).attr('href')
                
            })

            pos++


           })

           fighters[0].position = 'Champion'

        })

        res.json(fighters)
    })

    
})

app.listen(PORT, (err) => {
    if (err) console.log(err)

    console.log(`Listening on port ${PORT}`)


})