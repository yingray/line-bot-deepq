import { getMessageObj } from './intend'

export const doAction = async (e, client) => {
  try {
    const message = await getMessageObj(e, client)
    return client.pushMessage(e.source.userId, message)
  } catch (err) {
    console.log(err)
    return client.pushMessage(e.source.userId, {
      type: 'text',
      text: '[ERROR]小鯨魚發生錯誤\n' + err
    })
  }
}
