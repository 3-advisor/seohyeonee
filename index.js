const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
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
        // TODO: 정식 웹페이지로 변경 필요.
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
    res.status(200).end();

    const lineBot = new LineBot(LINE_API_TOKEN);
    lineBot.start(req.body);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`)
});