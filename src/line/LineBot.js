const Searcher = require('../common/Searcher');
const CommonLineBot = require('./CommonLineBot');
const MenuManager = require('../common/menuManager');

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

        let fs = require("fs");
        let contents = fs.readFileSync(process.env.URL + "/auth.json");
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
        for (let event of body.events) {
            if (event.type == 'message') {
                console.log(event);
                this.bot.setToken(event.replyToken);
                this.parse(event);
            }
        }
    }

    parse(event) {
        if (event.message.type === 'text') {
            let commandText = this._extractCommand(event.message.text);

            if (commandText) {
                this.runCommand(commandText, event);
            }
        }
    }

    _extractCommand(text) {
        const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/;
        let command = text.match(regExp);
        return command ? command[0].replace('/', '') : null;
    }

    _extractParameter(text) {
        const regExp = /^\/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/;
        return text.replace(regExp, '').trim();
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
        let promise = this.menuManager.get(this._extractParameter(event.message.text));
        promise.then((list) => {
            console.log(list);
            let item = this.pickRandom(list);
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
        let keyword = this._extractParameter(event.message.text);

        if (!keyword) {
            this.bot.replyText('이미지 검색 키워드가 없습니다.');
        } else {
            let promise = this.searcher.search(keyword);
            promise.then((result) => {
                this.bot.replyText(result);
            }).catch((reason) => {
                this.bot.replyText(reason);
            });
        }
    }

    sendSearchImage(event) {
        let keyword = this._extractParameter(event.message.text);

        if (!keyword) {
            this.bot.replyText('이미지 검색 키워드가 없습니다.');
        } else {
            let promise = this.searcher.searchImage(keyword);
            promise.then((url) => {
                console.log('index', url);
                this.bot.replyImage(url.origin, url.thumb);
            }).catch((reason) => {
                this.bot.replyText(reason);
            });
        }
    }

    sendRandom(event) {
        let text = this._extractParameter(event.message.text);
        if (text) {
            let params = text.split(' ');
            this.bot.replyText(`"${this.pickRandom(params)}"가 선택되었습니다.`);
        } else {
            this.bot.replyText('선택할 내용이 없습니다.');
        }
    }

    pickRandom(array) {
        return array && array.length ? array[Math.ceil(Math.random() * array.length) - 1] : null;
    }

    registerMenu(event) {
        if (_checkAuth(event, "registerMenu")) {
            let param = this._extractParameter(event.message.text).split(' ');
            let promise = this.menuManager.add(param[0], param[1]);

            promise.then((message) => {
                this.bot.replyText(message);
            }).catch((message) => {
                this.bot.replyText(message);
            });
        } else {
            this.bot.replyText('권한이 없습니다.');
        }
    }

    _checkAuth(event, usage) {
        const WHITE_LIST = "whiteList";
        const ACCESS_AUTH = "accessAuthorities";

        let userId = event.source.userId;
        let userAuthority = "";

        this.auth[WHITE_LIST].some(function (item) {
            if (item.userId === userId){
                userAuthority = item.authority;
                return true;
            }
        });

        return this.auth[ACCESS_AUTH][usage].includes(userAuthority);
    }
};