const request = require('request');

const GOOGLE_SEARCH_ENGINE_ID = process.env.GOOGLE_SEARCH_ENGINE_ID || '';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || '';
const GOOGLE_CUSTOM_SEARCH_API_URL = 'https://www.googleapis.com/customsearch/v1';

const BILLING_ERROR = 'This API requires billing to be enabled on the project.';

module.exports = class {
  constructor({
    ...options
  }) {
    this.useHTTPS = options.useHTTPS || false;
    this.googleSearchOptions = {
      safe: options.safe || 'high',
    };
  }

  searchImage(keyword) {
    const options = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
      searchType: 'image',
      q: encodeURIComponent(keyword),
      ...this.googleSearchOptions,
    };

    const searchFullUrl = this.makeUrl(options);

    return new Promise(((resolve, reject) => {
      request(searchFullUrl, (error, response, body) => {
        const json = JSON.parse(body);

        if (json.error) {
          if (json.error.message.includes(BILLING_ERROR)) {
            reject('구글 검색 API 하루 이용량을 초과하였습니다. (하루 100건) 오후 4~5시쯤에 초기화됩니다. ');
          }
          reject(`구글 API에서 에러가 발생하였습니다.\n에러코드: ${json.error.code},\n에러메세지: ${json.error.message}`);
        }

        const { items } = json;

        if (items) {
          const validImage = items.find((item) => {
            if (this.isValidImageUrl(item.link)) {
              return item;
            }
          });
          if (validImage) {
            resolve({
              origin: validImage.link,
              thumb: validImage.thumbnailLink,
            });
          } else {
            reject(`검색된 결과 중 전송 가능한 이미지가 없습니다.\n[검색결과 url:${items[0].link}]`);
          }
        } else {
          reject('검색된 결과가 없습니다.');
        }
      });
    }));
  }

  search(keyword) {
    const options = {
      key: GOOGLE_API_KEY,
      cx: GOOGLE_SEARCH_ENGINE_ID,
      q: encodeURIComponent(keyword),
    };

    const searchFullUrl = this.makeUrl(options);

    return new Promise(((resolve, reject) => {
      request(searchFullUrl, (error, response, body) => {
        const json = JSON.parse(body);

        if (json.error) {
          if (json.error.message.includes(BILLING_ERROR)) {
            reject('구글 검색 API 하루 이용량을 초과하였습니다. (하루 100건) 오후 4~5시쯤에 초기화됩니다. ');
          }
          reject(`구글 API에서 에러가 발생하였습니다.\n에러코드: ${json.error.code},\n에러메세지: ${json.error.message}`);
        }

        const { items } = json;

        if (items) {
          const text = `[${items[0].title}]\n${items[0].snippet}\n\n${items[0].link}`;
          console.log(text);
          resolve(text);
        } else {
          reject('검색된 결과가 없습니다.');
        }
      });
    }));
  }

  makeUrl(options) {
    let url = `${GOOGLE_CUSTOM_SEARCH_API_URL}?`;
    for (const option in options) {
      url += `${option}=${options[option]}&`;
    }
    console.log(`해당 url로 요청보냄: ${url}`);
    return url.slice(0, -1);
  }

  isHTTPS(url) {
    if (!this.useHTTPS) {
      return true;
    }
    return (/^https:\/\//u).test(url);
  }
};
