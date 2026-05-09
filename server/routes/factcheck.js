import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { extractTextFromPDF } from '../services/pdfExtractor.js';
import { extractClaims, verifyClaim } from '../services/claimVerifier.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/factcheck', upload.single('pdf'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No PDF uploaded' });

  // Set up Server-Sent Events for streaming progress
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const send = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  try {
    send({ stage: 'extracting', message: 'Extracting text from PDF...' });
    const text = await extractTextFromPDF(req.file.path);

    if (!text || text.trim().length < 50) {
      send({ stage: 'error', message: 'PDF appears to be empty or image-based (no extractable text found).' });
      res.end();
      return;
    }

    send({ stage: 'identifying', message: 'Identifying factual claims with Claude AI...' });
    const claims = await extractClaims(text);
    send({ stage: 'claims_found', count: claims.length, claims });

    const results = [];
    for (let i = 0; i < claims.length; i++) {
      send({
        stage: 'verifying',
        current: i + 1,
        total: claims.length,
        claim: claims[i].claim
      });

      try {
        const verification = await verifyClaim(claims[i]);
        const result = { ...claims[i], ...verification };
        results.push(result);
        send({ stage: 'claim_result', result });
      } catch (err) {
        console.error(`Error verifying claim ${i + 1}:`, err.message);
        const result = {
          ...claims[i],
          status: 'false',
          explanation: 'Verification failed: ' + err.message,
          corrected_fact: null,
          source: 'N/A',
          confidence: 'low'
        };
        results.push(result);
        send({ stage: 'claim_result', result });
      }

      // 15 RPM = one request every 4 seconds. Use 4500ms for safety buffer:
      await new Promise(r => setTimeout(r, 6500));
    }

    send({ stage: 'complete', results });

    // Clean up uploaded file
    try { fs.unlinkSync(req.file.path); } catch (e) {}
  } catch (err) {
    console.error('Factcheck route error:', err);
    send({ stage: 'error', message: err.message });
    try { fs.unlinkSync(req.file.path); } catch (e) {}
  }

  res.end();
});

export default router;
