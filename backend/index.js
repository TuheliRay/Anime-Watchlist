import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { readFileSync } from 'fs';
import { initAllCronJobs } from './cron/index.js';
initializeApp({
  credential: cert(JSON.parse(readFileSync('./config/service-key.json', 'utf8'))),
  projectId: process.env.FIREBASE_PROJECT_ID,
});
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Initialize cron jobs
initAllCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
