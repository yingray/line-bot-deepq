import { doAction } from './action'

class bot {
  constructor(client, events) {
    this.client = client
    this.events = events
    this.chatpool = [{
      a: 'U77b11b4090b7d93702b46bf3bb14d9fa',
      b: 'U9ac43d4678204baf7553bbd7bb80e424'
    }]
  }

  async start() {
    console.log(this.events)
    const promises = this.events.map(this.handleEvent.bind(this))
    return promises
  }

  handleEvent(e) {
    const userId = e.source.userId
    return doAction(e, this.client)
  }
}

export default bot
