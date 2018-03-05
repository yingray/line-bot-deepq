import {
  INTEND_GET_STICKER,
  INTEND_ECHO,
  INTEND_GET_MY_PROFILE,
  INTEND_GET_LOCATION,
  INTEND_GET_POSTBACK,
  INTEND_GET_BEACON
} from './constants'

const sticker = {
  id: '325708',
  type: 'sticker',
  packageId: '1',
  stickerId: '1'
}

const getSticker = () => sticker

const getProfileMessage = userId => {}

const getEcho = message => {}

const getIntend = e => {
  const { message } = e
  if (message.text) {
    switch (message.text.toLowerCase()) {
      case '去睡覺':
        return INTEND_GET_STICKER
      case 'profile':
        return INTEND_GET_MY_PROFILE
      case 'menu':
        return INTEND_GET_POSTBACK
      case 'beacon':
        return INTEND_GET_BEACON
      case 'location':
        return INTEND_GET_LOCATION
      default:
        return INTEND_ECHO
    }
  } else {
    return INTEND_GET_STICKER
  }
}

export const getMessageObj = async (e, client) => {
  const intend = getIntend(e)
  switch (getIntend(e)) {
    case INTEND_GET_STICKER:
      return sticker
    case INTEND_GET_MY_PROFILE:
      const userId = e.source.userId
      const profile = await client.getProfile(userId)
      console.log(profile)
      return {
        type: 'text',
        text: `Name: ${profile.displayName} \nUserID: ${userId} \nStatus: 
        ${profile.statusMessage} \nAvatar: ${profile.pictureUrl}`
      }
    case INTEND_GET_LOCATION:
      return {
        type: 'location',
        title: '小鯨魚的房間',
        address: '〒150-0002 東京都渋谷区渋谷２丁目２１−１',
        latitude: 35.65910807942215,
        longitude: 139.70372892916203
      }
    case INTEND_GET_POSTBACK:
      return {
        type: 'template',
        altText: 'this is a carousel template',
        template: {
          type: 'carousel',
          columns: [
            {
              thumbnailImageUrl: 'https://i.imgur.com/uzSuzZm.jpg',
              imageBackgroundColor: '#FFFFFF',
              title: '小鯨魚的辦公室',
              text: '歡迎光臨，小鯨魚的辦公室唷',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'https://mydeepq.deepq.com'
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=111'
                },
                {
                  type: 'postback',
                  label: 'Add to cart',
                  data: 'action=add&itemid=111'
                },
                {
                  type: 'uri',
                  label: 'Enter to MyDeepQ',
                  uri: `https://mydeepq.deepq.com?userid=${e.source.userId}`
                }
              ]
            },
            {
              thumbnailImageUrl: 'https://i.imgur.com/jlIMeCy.jpg',
              imageBackgroundColor: '#eeeeee',
              title: '小鯨魚的食物',
              text: '休憩室的日常',
              defaultAction: {
                type: 'uri',
                label: 'View detail',
                uri: 'http://example.com/page/222'
              },
              actions: [
                {
                  type: 'postback',
                  label: 'Buy',
                  data: 'action=buy&itemid=222'
                },
                {
                  type: 'postback',
                  label: 'Add to cart',
                  data: 'action=add&itemid=222'
                },
                {
                  type: 'uri',
                  label: 'View detail',
                  uri: 'http://example.com/page/222'
                }
              ]
            }
          ],
          imageAspectRatio: 'rectangle',
          imageSize: 'cover'
        }
      }
    default:
      return { type: 'text', text: `小鯨魚的回話：${e.message.text}` }
  }
}
