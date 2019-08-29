module.exports = class {
  constructor(apiConnector) {
    this.apiConnector = apiConnector;
  }

  setToken(token) {
    console.log(`replyToken: ${token}`);
    this.replyToken = token;
  }

  replyText(text) {
    const messages = [{
      type: 'text',
      text,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
  }

  pushText(to, text) {
    const messages = [{
      type: 'text',
      text,
    }];
    this.apiConnector.pushMessage(to, messages);
  }

  replyImage(originUrl, thumbUrl) {
    const messages = [{
      type: 'image',
      originalContentUrl: originUrl,
      previewImageUrl: thumbUrl,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
  }

  replyVideo(videoUrl, thumbUrl) {
    const messages = [{
      type: 'video',
      originalContentUrl: videoUrl,
      previewImageUrl: thumbUrl,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
  }

  replyAudio(audioUrl, duration) {
    const messages = [{
      type: 'video',
      originalContentUrl: audioUrl,
      duration,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
  }

  replySticker(stickerPackageId, stickerId) {
    const messages = [{
      type: 'sticker',
      packageId: stickerPackageId,
      stickerId,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
  }

  replyLocation(title, address, lat, long) {
    const messages = [{
      type: 'location',
      title,
      address,
      latitude: lat,
      longitude: long,
    }];
    this.apiConnector.replyMessage(this.replyToken, messages);
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
      const promise = this.apiConnector.getUserProfile(userId);
      promise.then((data) => {
        this.replyText(`${data.displayName}님.`);
      }).catch((reason) => {
        this.replyText(reason);
      });
    } else {
      this.replyText('유저 아이디가 없습니다.');
    }
  }

  getMembersIds(source) {
    let promise;
    console.log(source);
    switch (source.type) {
    case 'room':
      promise = this.apiConnector.getGroupMembersIDs(source.roomId);
      break;
    case 'group':
      promise = this.apiConnector.getRoomMembersIDs(source.groupId);
      break;
    default:
      this.replyText('그룹이나 방이 아닙니다.');
    }
    promise.then((data) => {
      const { memberIds } = data;
      console.log(memberIds);
      this.replyText(`${data.memberIds[0]}님.`);
    }).catch((reason) => {
      this.replyText(reason);
    });
  }

  getMemberProfile(source) {
    if (source.roomId) {
      this.apiConnector.getRoomMemberProfile(source.roomId, source.userId);
    } else if (source.groupId) {
      this.apiConnector.getGroupMemberProfile(source.groupId, source.userId);
    }
  }
};
