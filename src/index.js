import express from 'express'
import { middleware, JSONParseError, SignatureValidationFailed, Client } from '@line/bot-sdk'
import dotenv from 'dotenv'
import fs from 'fs'
import _ from 'lodash'

import bot from './bot'

const users = new Set()
const chatpool = []
const app = express()

if (process.env.DEV) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.dev'))
  for (var k in envConfig) {
    process.env[k] = envConfig[k]
  }
} else {
  dotenv.config()
}

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET
}

const client = new Client(config)

app.use(middleware(config))

app.post('/webhook', async (req, res) => {
  const userId = req.body.events[0].source.userId
  const message = req.body.events[0].message
  users.add(userId)
  Array.from(users).forEach(user => userId !== user && client.pushMessage(user, message))
  res.send('A_A')
})

app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Line BOT server has been started!')
})
