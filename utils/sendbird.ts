import SendbirdChat from '@sendbird/chat'
import { GroupChannelModule, GroupChannelListOrder, GroupChannelHandler } from '@sendbird/chat/groupChannel'
import { MentionType, UserMessageCreateParams, PushNotificationDeliveryOption, UserMessage, FileMessage, AdminMessage } from '@sendbird/chat/message'
import { v4 as uuid } from 'uuid'

export type TUserMessage = UserMessage
export type TMessage = (UserMessage | AdminMessage) & { isRead: boolean }

export type TSendbirdType = 'project'

type TSetUser = {
  nick: string;
  userId: string;
}

type TSetProps = {
  name: string;
  type: TSendbirdType;
  partnerId: string;
}

class Sendbird {
  sb = null
  channel = null
  user = null

  private nick = ''
  private name = ''
  private type: TSendbirdType = null
  private userId = ''
  private partnerId = ''

  constructor () {
    this.sb = SendbirdChat.init({
      appId: process.env.SEND_BIRD_APP_ID,
      localCacheEnabled: false,
      modules: [new GroupChannelModule()]
    })
  }

  setUser ({ nick, userId }: TSetUser) {
    this.nick = nick
    this.userId = userId
  }

  setProps ({ name, type = 'project', partnerId }: TSetProps) {
    this.name = name
    this.type = type
    this.partnerId = partnerId
  }

  async login () {
    await this.sb.connect(this.userId)
    await this.sb.setChannelInvitationPreference(true)
    this.user = this.sb.currentUser
    if (!this.user.nickname || this.user.nickname !== this.nick) {
      await this.sb.updateCurrentUserInfo({
        nickname: this.nick
      })
    }
    // console.log('login', this.user)
  }

  async getChannel () {
    const query = this.sb.groupChannel.createMyGroupChannelListQuery({
      channelNameContainsFilter: this.name,
      includeEmpty: true,
      customTypesFilter: [this.type],
      userIdsFilter: {
        userIds: [this.partnerId],
        includeMode: false,
        queryType: 'AND'
      },
      limit: 1,
      order: GroupChannelListOrder.LATEST_LAST_MESSAGE
    })
    const channels = await query.next()
    this.channel = (channels && channels.length > 0) ? channels[0] : undefined
  }

  async createChannel () {
    const params = {
      name: this.name,
      isPublic: false,
      customType: this.type,
      invitedUserIds: [this.userId, this.partnerId],
      isDistinct: false
    }
    this.channel = await this.sb.groupChannel.createChannel(params)
    await this.channel.inviteWithUserIds([this.userId, this.partnerId])
  }

  deleteChannel () {
    if (this.channel) this.channel.delete()
  }

  async connectChannel () {
    await this.getChannel()
    if (this.channel) return this.channel
    else await this.createChannel()
    return this.channel
  }

  async subscribeChannel (messageCallback, readCallback) {
    const channelHandler = new GroupChannelHandler({
      onMessageReceived: (_, message) => {
        messageCallback(message)
      },
      onUnreadMemberStatusUpdated: () => {
        readCallback()
      }
    })
    this.sb.groupChannel.addGroupChannelHandler(this.userId, channelHandler)
  }

  async checkReadMessages (messages) {
    return [...messages.map((m, index) => {
      const readMembers = this.channel.getReadMembers(m)
      if ((m as TUserMessage).sender) {
        const isMine = (m as TUserMessage).sender.userId === this.userId
        m.isRead = isMine ? !!readMembers.find(r => r.userId === this.partnerId) : true
      } else m.isRead = true
      return m
    })]
  }

  async getMessages (timestamp, prevResultSize, nextResultSize) {
    const messages: TMessage[] = await this.channel.getMessagesByTimestamp(
      timestamp, { prevResultSize, nextResultSize }
    )
    return await this.checkReadMessages(messages)
  }

  async markAsRead () {
    if (this.channel.unreadMessageCount) {
      await this.channel.markAsRead()
    }
  }

  send (message) {
    const params: UserMessageCreateParams = {
      message
      // mentionType: MentionType.USERS,
      // mentionedUserIds: [this.partnerId],
      // isReplyToChannel: true,
      // translationTargetLanguages: ['ko'],
      // pushNotificationDeliveryOption: PushNotificationDeliveryOption.DEFAULT
    }
    this.channel.sendUserMessage(params)
      .onSucceeded((message) => {
        const messageId = message.messageId
      }).onFailed((error) => {
        console.log(error, error.name, error.code, error.shouldThrowOutside)
      })
  }
}

export default Sendbird
