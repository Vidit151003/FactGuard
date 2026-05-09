import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import factcheckRouter from './routes/factcheck.js';
const app = express();

app.use(cors({
  origin: [
    'https://fact-guard-eight.vercel.app',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use('/api', factcheckRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`FactGuard server running on port ${PORT}`));
