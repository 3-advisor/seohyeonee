const MenuManager = require('../common/menuManager.js');
const AuthManager = require('../common/AuthManager.js');
const ACCESS_TARGET = require('../model/auth/AccessTarget.js');

// todo : env에서 설정하도록 하기?
const DELIMITER_DEFAULT = ' ';
const DELIMITER_SEND_RANDOM_MENU = '#';
const DELIMITER_REGISTER_MENU = '#';

module.exports = class {
  constructor(commonLineBot) {
    this.bot = commonLineBot;
    this.event = {};
    this.menuManager = new MenuManager();
    this.authManager = new AuthManager();
    this.init();
  }

  init() {
    this.command(['도움', 'help'], (event) => this.sendHelpMessage(event));
    this.command(['나가', 'leave'], (event) => this.sendLeaveMessage(event));
    this.command(['카페', 'cafe'], (event) => this.sendCafeMessage(event));
    this.command(['셔틀', 'shuttle'], (event) => this.sendShuttleMessage(event));
    this.command(['뭐먹지', 'food'], (event) => this.sendRandomMenu(event));
    this.command(['랜덤', 'random'], (event) => this.sendRandom(event));
    this.command('등록', (event) => this.registerMenu(event));
  }

  command(eventName, callback) {
    if (!this.event.command) {
      this.event.command = {};
    }
    if (Array.isArray(eventName)) {
      eventName.forEach((item) => {
        this.event.command[item] = callback;
      });
    } else {
      this.event.command[eventName] = callback;
    }
  }

  runCommand(keyword, obj) {
    if (this.event.command[keyword]) {
      this.event.command[keyword](obj);
    }
  }

  start(body) {
    for (const event of body.events) {
      if (event.type === 'message') {
        console.log(event);
        this.bot.setToken(event.replyToken);
        this.parse(event);
      }
    }
  }

  parse(event) {
    if (event.message.type === 'text') {
      const commandText = this.extractCommand(event.message.text);

      if (commandText) {
        this.runCommand(commandText, event);
      }
    }
  }

  extractCommand(text) {
    const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/u;
    const command = text.match(regExp);
    return command ? command[0].replace('/', '') : null;
  }

  extractParameter(text) {
    const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/u;
    return text.replace(regExp, '').trim();
  }

  extractParameterArray(text, delimiter = DELIMITER_DEFAULT) {
    const rawParams = this.extractParameter(text);

    const params = rawParams
      .replace(/( \s+)|(?! )(\s+)/ug, ' ') // 모든 공백 => 단일 공백
      .split(new RegExp(` *(?:${delimiter} *)+`, 'gu')) // split & trim
      .filter(param => param.length > 0); // 빈 원소는 버림

    console.log(params);
    return params;
  }

  sendHelpMessage() {
    this.bot.replyText('<사용 가능한 명령어>\n/검색 [검색어]: 검색\n/이미지 [검색어]: 이미지 검색\n/카페: 카페 시간표 보기\n/셔틀: 셔틀 시간표 보기\n/뭐먹지: 미래에셋 근처 음식점 랜덤 선택\n/나가: 봇이 대화방 나가기');
  }

  sendLeaveMessage(event) {
    if (event.source.roomId || event.source.groupId) {
      this.bot.replyText('흑흑..');
      this.bot.leave(event.source);
    } else {
      this.bot.replyText('그룹이나 단체 방이 아니면 나갈 수 없습니다.');
    }
  }

  sendRandomMenu(event) {
    const tagArray = this.extractParameterArray(event.message.text, DELIMITER_SEND_RANDOM_MENU);
    const promise = this.menuManager.get(tagArray);
    promise.then((list) => {
      console.log(list);
      const item = this.pickRandom(list);
      this.bot.replyText(`[${tagArray}] ${item.name}`);
    }).catch((reason) => {
      this.bot.replyText(reason);
    });
  }

  sendCafeMessage() {
    const originUrl = `${process.env.URL}/images/cafe.jpg`;
    const thumbUrl = `${process.env.URL}/images/cafe_thumb.jpg`;
    this.bot.replyImage(originUrl, thumbUrl);
  }

  sendShuttleMessage() {
    const originUrl = `${process.env.URL}/images/shuttle_2019_01_29.jpg`;
    const thumbUrl = `${process.env.URL}/images/shuttle_thumb_2019_01_29.jpg`;
    this.bot.replyImage(originUrl, thumbUrl);
  }

  sendRandomMember(source) {
    this.bot.getMembersIds(source);
  }

  sendRandom(event) {
    const params = this.extractParameterArray(event.message.text);
    if (params.length) {
      this.bot.replyText(`"${this.pickRandom(params)}"가 선택되었습니다.`);
    } else {
      this.bot.replyText('선택할 내용이 없습니다.');
    }
  }

  pickRandom(array) {
    return array && array.length ? array[Math.ceil(Math.random() * array.length) - 1] : null;
  }

  registerMenu(event) {
    const { userId } = event.source;

    this.authManager.check(userId, ACCESS_TARGET.REGISTER_MENU).then((result) => {
      console.log('registerMenu', result);

      if (result) {
        console.log('권한 있음');
        const params = this.extractParameterArray(event.message.text, DELIMITER_REGISTER_MENU);
        const [menuName] = params; // menuName = params[0];
        const tagArray = params.slice(1);
        const promise = this.menuManager.add(menuName, tagArray);

        promise.then((message) => {
          this.bot.replyText(message);
        }).catch((message) => {
          this.bot.replyText(message);
        });
      } else {
        console.log('권한 없음');
        this.bot.replyText('권한이 없습니다.');
      }
    })
      .catch((reason) => {
        this.bot.replyText(reason);
      });
  }
};
