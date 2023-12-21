const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const URLSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    }
})

const URLModel = new mongoose.model('URL', URLSchema)

const app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

app.get('/api/whoami', (req, res) => {
    res.json({"ipaddress":req.ip,
    "language":req.headers['accept-language'],
    "software":req.headers['user-agent']})
})

app.post('/api/shorturl', bodyParser.urlencoded({extended:false}), (req, res) => {
    try {
        new URL(req.body.url)
        short_url = URLModel.create({url: req.body.url}).then(data => {
            res.json({"original_url": req.body.url, "short_url":data._id});
        }).catch(e => console.log(e))
    } catch (TypeError) {
        res.json({"error": "invalid url"})
    }
})

app.get('/api/shorturl/:id', (req, res) => {
    URLModel.findById(req.params.id).then(data => {
        res.redirect(`//${data.url}`);
    }).catch(err => {
        console.log(err)
        res.json({'error':"Couldn't find url"})
    })
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