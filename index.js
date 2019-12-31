const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
const CommonLineBot = require('./src/line/CommonLineBot');
const APIConnector = require('./src/line/APIConnector');
const TestAPIConnector = require('./src/line/TestAPIConnector');

const dotEnvStorage = require('./src/util/dotEnvStorage');

const apiRouter = require('./src/routes/api');

const Restaurant = require('./src/model/Restaurant');


const LINE_API_TOKEN = dotEnvStorage.lineApiToken;
const PORT = dotEnvStorage.mongoosePort;
const MONGODB_URI = dotEnvStorage.mongoDbUri;

const app = express();

if (MONGODB_URI) {
  console.log(`try connect to : ${MONGODB_URI}`);

  mongoose.connect(
    MONGODB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.error(err);
        console.log(`extras: ${MONGODB_URI}`);
      }
      console.log('일단 들어왔음');
    }
  );
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
    commonLineBot = new CommonLineBot(new APIConnector(LINE_API_TOKEN));
  }
  const lineBot = new LineBot(commonLineBot);
  lineBot.start(req.body);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
