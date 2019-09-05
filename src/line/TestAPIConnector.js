const APIConnector = require('./APIConnector');

module.exports = class TestAPIConnector extends AbstractAPIConnector {
  constructor(res) {
    super();
    this.res = res;
    this.channelAccessToken = 'channelAccessToken';
  }

  post(url, body) {
    console.log('post');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.channelAccessToken}`,
    };
    const options = {
      url,
      method: 'POST',
      headers,
      body,
      json: true,
    };
    this.res.json(options);
  }

  get(url) {
    console.log('get');
    const headers = {
      Authorization: `Bearer ${this.channelAccessToken}`,
    };

    const options = {
      url,
      method: 'GET',
      headers,
      json: true,
    };
    this.res.json(options);
  }
};
