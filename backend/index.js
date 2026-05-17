import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { initializeApp, cert } from 'firebase-admin/app';
import { readFileSync, existsSync } from 'fs';
import { initAllCronJobs } from './cron/index.js';

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }
  const path = './config/service-key.json';
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }
  throw new Error(
    'Firebase credentials missing. Set FIREBASE_SERVICE_ACCOUNT_JSON or add config/service-key.json'
  );
}

const serviceAccount = getServiceAccount();

initializeApp({
  credential: cert(serviceAccount),
  projectId: process.env.FIREBASE_PROJECT_ID ?? serviceAccount.project_id,
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
