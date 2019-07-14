const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
const CommonLineBot = require('./src/line/CommonLineBot');
const APIConnector = require('./src/line/APIConnector');
const TestAPIConnector = require('./src/line/TestAPIConnector');

const Restaurant = require('./src/model/Restaurant');

const LINE_API_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || 'DUMMY_LINE_CHANNEL_ACCESS_TOKEN';
const PORT = process.env.PORT || 3000;

const app = express();
if (process.env.NODE_ENV == 'production') {
    mongoose.connect(process.env.MONGODB_URI);
}

app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    if (process.env.NODE_ENV == 'production') {
        Restaurant.find(function (err, list) { // 데이터 임시 출력
            if (err) return res.status(500).send({
                error: 'database failure'
            });
            res.json(list);
        });
    } else if (process.env.NODE_ENV == 'development') {
        res.sendFile(path.join(__dirname, '/src/views/test.html'));
    }
});

app.post('/line-webhook', express.json(), function (req, res) {
    let commonLineBot = null;
    if (process.env.NODE_ENV == 'development') {
        commonLineBot = new CommonLineBot(new TestAPIConnector(res));
    } else if (process.env.NODE_ENV == 'production') {
        res.status(200).end();
        commonLineBot = new CommonLineBot(new APIConnector(LINE_API_TOKEN));
    }
    const lineBot = new LineBot(commonLineBot);
    lineBot.start(req.body);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
});