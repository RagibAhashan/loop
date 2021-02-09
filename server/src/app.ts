import cors from 'cors';
import express, { Application } from 'express'
import { initializeApp } from 'firebase-admin';
import * as admin from "firebase-admin";
import { exit } from 'process';

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