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
    constructor(res) {
        this.res = res;
        this.channelAccessToken = 'channelAccessToken';
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
        let options = {
            url: url,
            method: "POST",
            headers: headers,
            body: body,
            json: true
        }
        this.res.json(options);
    }

    get(url) {
        let headers = {
            "Authorization": "Bearer " + this.channelAccessToken
        };

        let options = {
            url: url,
            method: "GET",
            headers: headers,
            json: true
        };
        this.res.json(options);

    }
};