const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const LineBot = require('./src/line/LineBot');
const CommonLineBot = require('./src/line/CommonLineBot');
const RealAPIConnector = require('./src/line/RealAPIConnector');
const TestAPIConnector = require('./src/line/TestAPIConnector');

const Restaurant = require('./src/model/Restaurant');

const apiRouter = require('./routes/api');

dotenv.config({ path: './local.env' });

const LINE_API_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || 'DUMMY_LINE_CHANNEL_ACCESS_TOKEN';
const PORT = process.env.PORT || 3000;
const MONGODB_URI = (process.env.DB_ENV === 'local') ? process.env.MONGODB_LOCAL_URI : process.env.MONGODB_URI;

const app = express();

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI);
} else {
  const ERROR_MSG_DB_NOT_CONNECTED = `DB not connected. It may not work. (process.env.MONGODB_RUI = ${process.env.MONGODB_URI})`;
  const RED_MSG_START = '\x1b[41m';
  const RED_MSG_END = '\x1b[0m';
  console.error(`${RED_MSG_START}${ERROR_MSG_DB_NOT_CONNECTED}${RED_MSG_END}`);
}

app.use(express.static(path.join(__dirname, 'static')));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    Restaurant.find((err, list) => { // 데이터 임시 출력
      if (err) return res.status(500).send({
        error: 'database failure',
      });
      res.json(list);
    });
  } else if (process.env.NODE_ENV === 'development') {
    res.sendFile(path.join(__dirname, '/src/views/test.html'));
  }
});

app.post('/line-webhook', express.json(), (req, res) => {
  let commonLineBot = null;
  if (process.env.NODE_ENV === 'development') {
    commonLineBot = new CommonLineBot(new TestAPIConnector(res));
  } else if (process.env.NODE_ENV === 'production') {
    res.status(200).end();
    commonLineBot = new CommonLineBot(new RealAPIConnector(LINE_API_TOKEN));
  }
  const lineBot = new LineBot(commonLineBot);
  lineBot.start(req.body);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
