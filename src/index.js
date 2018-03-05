import express from 'express'
import { middleware, JSONParseError, SignatureValidationFailed, Client } from '@line/bot-sdk'
import dotenv from 'dotenv'
import fs from 'fs'
import firebase from 'firebase'
import _ from 'lodash'

if (process.env.DEV) {
  const envConfig = dotenv.parse(fs.readFileSync('.env.dev'))
  for (var k in envConfig) {
    process.env[k] = envConfig[k]
  }
} else {
  dotenv.config()
}

firebase.initializeApp({
  apiKey: process.env.FIR_KEY,
  authDomain: `${process.env.PROJECT_NAME}.firebaseapp.com`,
  databaseURL: `https://${process.env.PROJECT_NAME}.firebaseio.com`,
  projectId: process.env.PROJECT_NAME,
  storageBucket: `${process.env.PROJECT_NAME}.appspot.com`,
  messagingSenderId: process.env.MSI
})

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.SECRET
}
const client = new Client(config)
let users = []
const app = express()
const usersRef = firebase.database().ref('users')

usersRef.on('value', function(snapshot) {
  updateUsers(snapshot.val())
})

function updateUsers(allUsers) {
  users = _.map(allUsers, (v, k) => k)
}

function getUserProfile(userId) {
  return firebase
    .database()
    .ref('users/' + userId)
    .once('value')
    .then(s => s.val())
}

async function createUserProfile(userId) {
  console.log('Create New User')
  const profile = await client.getProfile(userId)
  await writeUserData(userId, profile)
  return profile
}

function writeUserData(userId, profile) {
  return firebase
    .database()
    .ref('users/' + userId)
    .set(profile)
}

app.use(middleware(config))

app.post('/webhook', async (req, res) => {
  const userId = req.body.events[0].source.userId
  const message = req.body.events[0].message
  let profile = await getUserProfile(userId)
  if (!profile) {
    profile = await createUserProfile(userId)
  }
  users.forEach(user => userId !== user && client.pushMessage(user, message))
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
