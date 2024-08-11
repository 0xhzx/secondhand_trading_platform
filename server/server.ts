import express from 'express'
import bodyParser from 'body-parser'
import pino from 'pino'
import cors from 'cors'
import expressPinoLogger from 'express-pino-logger'
import { Collection, Db, MongoClient, ObjectId } from 'mongodb'
import { Issuer, Strategy, generators } from 'openid-client'
import session from 'express-session'
import passport from 'passport'
import MongoStore from 'connect-mongo'
import { Strategy as CustomStrategy } from "passport-custom"
import { gitlab } from './secrets'
import User from './models/User'

// newly added imports 
import routes from './controllers/index'
import './database/db_utils'
import { setup } from './controllers/userController'
import { setup as setupProduct } from './controllers/productController'

import { ADMIN, USER } from './config/config' 


// set up Mongo
const onlineMongoUrl = "mongodb+srv://tmp_user:cs590@cs590.lb5ykha.mongodb.net/shopping?retryWrites=true&w=majority&appName=CS590";
const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
const client = new MongoClient(url)
let db: Db

// RBAC config
const OPERATOR_GROUP_ID = '590-store-admins'

const DISABLE_SECURITY = process.env.DISABLE_SECURITY
export const passportStrategies = [
  ...(DISABLE_SECURITY ? ["disable-security"] : []),
  "oidc",
]

// set up Express
const app = express()
const port = 8191
const HOST = process.env.HOST || "127.0.0.1"
const EXTERNAL_PORT = process.env.EXTERNAL_PORT || "8082"
// const HOST = process.env.HOST || "localhost"

// set up body parsing for both JSON and URL encoded
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set up Pino logging
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
})
app.use(expressPinoLogger({ logger }))

// set up CORS
app.use(cors({
  // origin: "http://127.0.0.1:8082",
  origin: `http://${HOST}:${EXTERNAL_PORT}`,
  credentials: true,
}))

// set up session
app.use(session({
  secret: 'this is the-best secret ever',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },

  store: MongoStore.create({
    mongoUrl: onlineMongoUrl,
    ttl: 14 * 24 * 60 * 60 // 14 days
  })
}))
declare module 'express-session' {
  export interface SessionData {
    credits?: number
  }
}


app.use(passport.initialize())
app.use(passport.session())
passport.serializeUser((user: any, done) => {
  console.log("serializeUser", user)
  done(null, user)
})
passport.deserializeUser((user: any, done) => {
  console.log("deserializeUser", user)
  done(null, user)
})


passport.use("disable-security", new CustomStrategy((req, done) => {
  console.log("disable-security: ", req.query)
  if (req.query.key !== DISABLE_SECURITY) {
    console.log("you must supply ?key=" + DISABLE_SECURITY + " to log in via DISABLE_SECURITY")
    done(null, false)
  } else {
    done(null, { user_id: req.query.id, name: req.query.user, roles: [].concat(req.query.role) })
  }
}))

Issuer.discover("https://coursework.cs.duke.edu/").then(issuer => {
  const client = new issuer.Client(gitlab)

  const params = {
    scope: 'openid profile email',
    nonce: generators.nonce(),
    redirect_uri: `http://${HOST}:${EXTERNAL_PORT}/api/users/login-callback`,
    state: generators.state(),
  }

  async function verify(tokenSet: any, userInfo: any, done: (error: any, user: any) => void) {
    console.log('userInfo', userInfo)
    console.log('tokenSet', tokenSet)

    console.log('groups: ', userInfo.groups)
    userInfo.roles = userInfo.groups.includes(OPERATOR_GROUP_ID) ? ADMIN : USER
    console.log('userInfo roles: ', userInfo.roles)
    
    try {
      // Find the user in the database, or create a new user if it doesn't exist
      const user = await User.findOneAndUpdate(
        { user_id: userInfo.sub },  // Find a document with this user_id
        { name: userInfo.name, email: userInfo.email, roles: userInfo.roles },  // Update the document with this data
        { upsert: true, new: true }  // Options: create the document if it doesn't exist, and return the updated document
      );
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }

  passport.use('oidc', new Strategy({ client, params }, verify))
})



app.use('/api/users', setup(passport));
app.use('/api/products', setupProduct(passport));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

