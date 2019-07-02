const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
const Restaurant = require('./src/model/Restaurant');

const LINE_API_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || '';
const PORT = process.env.PORT || 3000;

const app = express();
mongoose.connect(process.env.MONGODB_URI);

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    Restaurant.find(function (err, list) {
        if (err) return res.status(500).send({
            error: 'database failure'
        });
        res.json(list);
    });
});

app.post('/line-webhook', express.json(), function (req, res) {
    res.status(200).end();

    const lineBot = new LineBot(LINE_API_TOKEN);
    lineBot.start(req.body);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
});