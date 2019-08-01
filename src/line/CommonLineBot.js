const APIConnector = require("./APIConnector");

module.exports = class {
    constructor(apiConnector) {
        this.apiConnector = apiConnector;
    }

    setToken(token) {
        console.log(`replyToken: ${token}`);
        this._replyToken = token;
    }

    replyText(text) {
        let messages = [{
            type: "text",
            text: text
        }];
        this.apiConnector.replyMessage(this._replyToken, messages);
    }
    pushText(to, text) {
        let messages = [{
            type: "text",
            text: text
        }];
        this.apiConnector.pushMessage(to, messages)
    }

    replyImage(originUrl, thumbUrl) {
        let messages = [{
            type: "image",
            originalContentUrl: originUrl,
            previewImageUrl: thumbUrl
        }];
        this.apiConnector.replyMessage(this._replyToken, messages);
    }

    replyVideo(videoUrl, thumbUrl) {
        let messages = [{
            type: "video",
            originalContentUrl: videoUrl,
            previewImageUrl: thumbUrl
        }];
        apiConnector.replyMessage(this._replyToken, messages);
    }

    replyAudio(audioUrl, duration) {
        let messages = [{
            type: "video",
            originalContentUrl: audioUrl,
            duration: duration
        }];
        this.apiConnector.replyMessage(this._replyToken, messages);
    }

    replySticker(stickerPackageId, stickerId) {
        let messages = [{
            type: "sticker",
            packageId: stickerPackageId,
            stickerId: stickerId
        }];
        this.apiConnector.replyMessage(this._replyToken, messages);
    }

    replyLocation(title, address, lat, long) {
        let messages = [{
            "type": "location",
            "title": title,
            "address": address,
            "latitude": lat,
            "longitude": long
        }];
        this.apiConnector.replyMessage(this._replyToken, messages);
    }

    leave(source) {
        if (source.roomId) {
            this.apiConnector.leaveRoom(source.roomId);
        } else if (source.groupId) {
            this.apiConnector.leaveGroup(source.groupId);
        }
        return false;
    }
    getUserProfile(userId) {
        if (userId) {
            let promise = this.apiConnector.getUserProfile(userId);
            promise.then((data) => {
                this.replyText(`${data.displayName}님.`);
            }).catch((reason) => {
                this.replyText(reason);
            });
        } else {
            this.replyText(`유저 아이디가 없습니다.`);
        }
    }
    getMembersIds(source) {
        let promise;
        console.log(source);
        switch (source.type) {
            case "room":
                promise = this.apiConnector.getGroupMembersIDs(source.roomId);
                break;
            case "group":
                promise = this.apiConnector.getRoomMembersIDs(source.groupId);
                break;
            default:
                this.replyText("그룹이나 방이 아닙니다.");
        }
        promise.then((data) => {
            let memberIds = data.memberIds;
            console.log(memberIds);
            this.replyText(`${data.memberIds[0]}님.`);
        }).catch((reason) => {
            this.replyText(reason);
        });

    }
    getMemberProfile(source) {
        let promise;
        if (source.roomId) {
            promise = this.apiConnector.getRoomMemberProfile(source.roomId, source.userId);
        } else {
            promise = this.apiConnector.getGroupMemberProfile(source.groupId, source.userId);
        }
    }
};