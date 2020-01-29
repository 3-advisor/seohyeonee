const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const LineBot = require('./src/line/LineBot');
const CommonLineBot = require('./src/line/CommonLineBot');
const RealAPIConnector = require('./src/line/RealAPIConnector');
const TestAPIConnector = require('./src/line/TestAPIConnector');

const ENV = require('./src/util/dotEnvStorage');

const apiRouter = require('./src/routes/api');

const app = express();

if (ENV.MONGO_DB_URI) {
  console.log(`try connect to : ${ENV.MONGO_DB_URI}`);

  mongoose.connect(
    ENV.MONGO_DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.error(err);
        console.log(`mongodb uri: ${ENV.MONGO_DB_URI}`);
      }
    }
  );
} else {
  const ERROR_MSG_DB_NOT_CONNECTED = `DB not connected. It may not work. (MONGO_DB_URI = ${ENV.MONGO_DB_URI})`;
  const RED_MSG_START = '\x1b[41m';
  const RED_MSG_END = '\x1b[0m';
  console.error(`${RED_MSG_START}${ERROR_MSG_DB_NOT_CONNECTED}${RED_MSG_END}`);
}

app.use(express.static(path.join(__dirname, 'static')));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/src/views/index.html'));
});

app.get('/test', (req, res) => {
  if (process.env.NODE_ENV === 'development') {
    res.sendFile(path.join(__dirname, '/src/views/test.html'));
  }
});

app.post('/line-webhook', express.json(), (req, res) => {
  let commonLineBot = null;
  if (process.env.NODE_ENV === 'development') {
    commonLineBot = new CommonLineBot(new TestAPIConnector(res));
  } else if (process.env.NODE_ENV === 'production') {
    res.status(200).end();
    commonLineBot = new CommonLineBot(new RealAPIConnector(ENV.LINE_API_TOKEN));
  }
  const lineBot = new LineBot(commonLineBot);
  lineBot.start(req.body);
});

app.listen(ENV.PORT, () => {
  console.log(`App listening on port ${ENV.PORT}!`);
});
