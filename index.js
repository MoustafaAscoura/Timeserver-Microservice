const express = require('express');
const app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

app.get('/api/whoami', (req, res) => {
    res.json({"ipaddress":req.ip,
    "language":req.headers['accept-language'],
    "software":req.headers['user-agent']})
})

app.get('/api/:date?', (req, res) => {
    let input = req.params.date
    input = String(parseInt(input)) === input ? parseInt(input) : input

    let date = input? new Date(input) : new Date()
    let unix = date.getTime()
    if (date.toString() === "Invalid Date"){
        res.json({'error': 'Invalid Date'})
    } else {
        res.json({'unix': unix, 'utc': date.toUTCString()})
    }


    
})



const listener = app.listen(3000, () => {
    console.log('Server is listening on port 3000 ...')
})