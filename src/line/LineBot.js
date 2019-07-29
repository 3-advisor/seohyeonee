const Searcher = require('../common/Searcher');
const CommonLineBot = require('./CommonLineBot');
const MenuManager = require('../common/menuManager');
const path = require('path');

module.exports = class {
    constructor(token) {
        this.bot = new CommonLineBot(token);
        this.searcher = new Searcher({
            useHTTPS: true
        });
        this.menuManager = new MenuManager();
        this.event = {};
        this.auth = {};
        this.init();
    }

    init() {
        this.command('도움', (event) => this.sendHelpMessage(event));
        this.command('help', (event) => this.sendHelpMessage(event));
        this.command('나가', (event) => this.sendLeaveMessage(event));
        this.command('leave', (event) => this.sendLeaveMessage(event));
        this.command('카페', (event) => this.sendCafeMessage(event));
        this.command('cafe', (event) => this.sendCafeMessage(event));
        this.command('셔틀', (event) => this.sendShuttleMessage(event));
        this.command('shuttle', (event) => this.sendShuttleMessage(event));
        this.command('이미지', (event) => this.sendSearchImage(event));
        this.command('image', (event) => this.sendSearchImage(event));
        this.command('검색', (event) => this.sendSearchResult(event));
        this.command('search', (event) => this.sendSearchResult(event));
        this.command('뭐먹지', (event) => this.sendRandomMenu(event));
        this.command('랜덤', (event) => this.sendRandom(event));
        this.command('등록', (event) => this.registerMenu(event));

        const fs = require("fs");
        const contents = fs.readFileSync(path.join(__dirname, '../../static/auth.json'));
        this.auth = JSON.parse(contents);
    }

    command(name, callback) {
        if (!this.event.command) {
            this.event.command = {};
        }
        this.event.command[name] = callback;
    }

    runCommand(keyword, obj) {
        if (this.event.command[keyword]) {
            this.event.command[keyword](obj);
        }
    }

    start(body) {
        for (const event of body.events) {
            if (event.type == 'message') {
                console.log(event);
                this.bot.setToken(event.replyToken);
                this.parse(event);
            }
        }
    }

    parse(event) {
        if (event.message.type === 'text') {
            const commandText = this._extractCommand(event.message.text);

            if (commandText) {
                this.runCommand(commandText, event);
            }
        }
    }

    _extractCommand(text) {
        const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/;
        const command = text.match(regExp);
        return command ? command[0].replace('/', '') : null;
    }

    _extractParameter(text) {
        const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/;
        return text.replace(regExp, '').trim();
    }

    _extractParameterArray(text) {
        const regExp = /\S+/g;
        return this._extractParameter(text).match(regExp) || [];
    }

    sendHelpMessage() {
        this.bot.replyText(`<사용 가능한 명령어>\n/검색 [검색어]: 검색\n/이미지 [검색어]: 이미지 검색\n/카페: 카페 시간표 보기\n/셔틀: 셔틀 시간표 보기\n/뭐먹지: 미래에셋 근처 음식점 랜덤 선택\n/나가: 봇이 대화방 나가기`);
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
        const promise = this.menuManager.get(this._extractParameterArray(event.message.text));
        promise.then((list) => {
            console.log(list);
            const item = this.pickRandom(list);
            this.bot.replyText(`[${item.category}] ${item.name}`);
        }).catch((reason) => {
            this.bot.replyText(reason);
        });
    }

    sendCafeMessage() {
        const originUrl = process.env.URL + '/images/cafe.jpg';
        const thumbUrl = process.env.URL + '/images/cafe_thumb.jpg';
        this.bot.replyImage(originUrl, thumbUrl);
    }

    sendShuttleMessage() {
        const originUrl = process.env.URL + '/images/shuttle_2019_01_29.jpg';
        const thumbUrl = process.env.URL + '/images/shuttle_thumb_2019_01_29.jpg';
        this.bot.replyImage(originUrl, thumbUrl);
    }
    sendRandomMember(source) {
        this.bot.getMembersIds(source);
    }

    sendSearchResult(event) {
        const keyword = this._extractParameter(event.message.text);

        if (!keyword) {
            this.bot.replyText('이미지 검색 키워드가 없습니다.');
        } else {
            const promise = this.searcher.search(keyword);
            promise.then((result) => {
                this.bot.replyText(result);
            }).catch((reason) => {
                this.bot.replyText(reason);
            });
        }
    }

    sendSearchImage(event) {
        const keyword = this._extractParameter(event.message.text);

        if (!keyword) {
            this.bot.replyText('이미지 검색 키워드가 없습니다.');
        } else {
            const promise = this.searcher.searchImage(keyword);
            promise.then((url) => {
                console.log('index', url);
                this.bot.replyImage(url.origin, url.thumb);
            }).catch((reason) => {
                this.bot.replyText(reason);
            });
        }
    }

    sendRandom(event) {
        const params = this._extractParameterArray(event.message.text);
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
        if (this._checkAuth(event, "registerMenu")) {
            console.log('권한 있음');
            const params = this._extractParameterArray(event.message.text);
            const promise = this.menuManager.add(params[0], params[1]);

            promise.then((message) => {
                this.bot.replyText(message);
            }).catch((message) => {
                this.bot.replyText(message);
            });
        } else {
            console.log('권한 없음');
            this.bot.replyText('권한이 없습니다.');
        }
    }

    _checkAuth(event, usage) {
        const WHITE_LIST = "whiteList";
        const ACCESS_AUTH = "accessAuthorities";

        const userId = event.source.userId;
        let userAuthority = "";

        this.auth[WHITE_LIST].some(function (item) {
            if (item.userId === userId) {
                userAuthority = item.authority;
                return true;
            }
        });

        return this.auth[ACCESS_AUTH][usage].includes(userAuthority);
    }
};