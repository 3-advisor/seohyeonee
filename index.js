const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
const Restaurant = require('./src/model/Restaurant');

dotenv.config({ path: './local.env' });

const LINE_API_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || 'DUMMY_LINE_CHANNEL_ACCESS_TOKEN';
const PORT = process.env.PORT || 3000;
const MONGODB_URI = (process.env.DB_ENV === 'local') ? process.env.MONGODB_LOCAL_URI : process.env.MONGODB_URI;

const app = express();

if (MONGODB_URI) {
    mongoose.connect(MONGODB_URI);
} else {
    const ERROR_MSG_DB_NOT_CONNECTED = `DB not connected. It may not work. (process.env.MONGODB_RUI = ${process.env.MONGODB_URI})`;
    const RED_MSG_START = `\x1b[41m`;
    const RED_MSG_END = `\x1b[0m`;
    console.error(`${RED_MSG_START}${ERROR_MSG_DB_NOT_CONNECTED}${RED_MSG_END}`);
}

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    Restaurant.find(function (err, list) {
        if (err) return res.status(500).send({
            error: 'database failure'
        });
        res.json(list);
    });
});

app.post('/line-webhook', bodyParser.json(), function (req, res) {
    res.status(200).end();

    const lineBot = new LineBot(LINE_API_TOKEN);
    lineBot.start(req.body);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
});