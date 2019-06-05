const request = require("request");

const API_HOST = "https://api.line.me/v2/bot";
const API_REPLY_URL = API_HOST + "/message/reply";
const API_PUSH_URL = API_HOST + "/message/push";
const API_LEAVE_GROUP_URL = API_HOST + "/group/{groupId}/leave";
const API_LEAVE_ROOM_URL = API_HOST + "/room/{roomId}/leave";
const API_GET_USER_PROFILE_URL = API_HOST + "/profile/{userId}";
const API_GET_GROUP_MEMBERS_ID_URL = API_HOST + "/group/{groupId}/members/ids";
const API_GET_ROOM_MEMBERS_ID_URL = API_HOST + "/room/{roomId}/members/ids";
const API_GET_GROUP_MEMBER_PROFILE_URL = API_HOST + "/group/{groupId}/member/{userId}";
const API_GET_ROOM_MEMBER_PROFILE_URL = API_HOST + "/room/{roomId}/member/{userId}";

module.exports = class {
    constructor(channelAccessToken) {
        if (!channelAccessToken) {
            throw "Channel Access Token is required."
        }
        this.channelAccessToken = channelAccessToken;
    }

    replyMessage(replyToken, messages) {
        let body = {
            replyToken: replyToken,
            messages: messages,
        };
        this.post(API_REPLY_URL, body);
    }

    pushMessage(to, messages) { // featured 
        let body = {
            to: to,
            messages: messages,
        };
        this.post(API_REPLY_URL, body);
    }

    leaveGroup(groupId) {
        let url = API_LEAVE_GROUP_URL.replace("{groupId}", groupId);
        this.post(url);
    }

    leaveRoom(roomId) {
        let url = API_LEAVE_ROOM_URL.replace("{roomId}", roomId);
        this.post(url);
    }

    getUserProfile(userId) {
        let url = API_GET_USER_PROFILE_URL.replace("{userId}", userId);
        return this.get(url);
    }

    getGroupMembersIDs(groupId) {
        let url = API_GET_GROUP_MEMBERS_ID_URL.replace("{groupId}", groupId);
        return this.get(url);
    }

    getRoomMembersIDs(roomId) {
        let url = API_GET_ROOM_MEMBERS_ID_URL.replace("{roomId}", roomId);
        console.log(url);
        return this.get(url);
    }

    getGroupMemberProfile(groupId, userId) {
        let url = API_GET_GROUP_MEMBER_PROFILE_URL.replace("{groupId}", groupId).replace("{userId}", userId);
        return this.get(url);
    }

    getRoomMemberProfile(roomId, userId) {
        let url = API_GET_ROOM_MEMBER_PROFILE_URL.replace("{roomId}", roomId).replace("{userId}", userId);
        return this.get(url);
    }

    post(url, body) {
        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + this.channelAccessToken
        };
        request({
            url: url,
            method: "POST",
            headers: headers,
            body: body,
            json: true
        });
    }

    get(url) {
        let headers = {
            "Authorization": "Bearer " + this.channelAccessToken
        };

        return new Promise(function (resolve, reject) {
            request({
                url: url,
                method: "GET",
                headers: headers,
                json: true
            }, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                    resolve(body);
                } else {
                    reject(`통신에 문제가 발생하였습니다. statusCode:${response.statusCode}`);
                }
            });
        });
    }
};