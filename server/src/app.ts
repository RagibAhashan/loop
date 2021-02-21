import cors from 'cors';
import express, { Application } from 'express'
import { initializeApp } from 'firebase-admin';
import * as admin from "firebase-admin";
import { exit } from 'process';
import session from 'express-session';
import passport from 'passport';
// import discordStrategy from './routes/Discord/strategies/discordStrategy'



const FULL_DAY = 60000*60*24;

const RunServer = () => {
  initializeApp();
  
  const app: Application = express();
  
  const corsOptions = {
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Authorization,Uid,Access-Control-Allow-Origin,Origin,X-Requested-With,Content-Type,Accept',
    exposedHeaders: 'Location',
  };
  
  app.use(session({
    secret: 'random shit here',
    cookie: {
      maxAge: FULL_DAY
    },
    saveUninitialized: false
  }));

  app.use(passport.initialize());
  app.use(passport.session())
  
  app.use(cors(corsOptions));

  app.use(require('./routes').default);
  
  const PORT = process.env.PORT || 8000;
  
  app.listen(PORT, () => {
    console.log(`Listning in port ${PORT}`)
  })
}

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS &&
    !process.env.DB_URL) {
  console.log('Environment variables missing...')
  console.log('GOOGLE_APPLICATION_CREDENTIALS & DB_URL are needed.')
  process.exit();
} else {
  RunServer();
}
