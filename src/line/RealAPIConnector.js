const axios = require('axios');

const APIConnector = require('./APIConnector');

module.exports = class extends APIConnector {
  constructor(channelAccessToken) {
    super();
    if (!channelAccessToken) {
      throw Error('Channel Access Token is required.');
    }
    this.channelAccessToken = channelAccessToken;
  }

  post(url, data) {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.channelAccessToken}`,
    };

    const options = {
      url,
      method: 'POST',
      headers,
      data,
    };

    axios(options);
  }

  get(url) {
    const headers = {
      Authorization: `Bearer ${this.channelAccessToken}`,
    };

    const options = {
      url,
      method: 'GET',
      headers,
    };

    return new Promise(((resolve, reject) => {
      axios(options)
        .then((response) => resolve(response.data))
        .catch((err) => reject(`통신에 문제가 발생하였습니다. statusCode:${err.statusCode}`));
    }));
  }
};
