import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Model for claim EXTRACTION (no search needed, faster + free) ────────────
const extractionModel = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  generationConfig: {
    temperature: 0.1,       // Low temp = more deterministic, better for JSON
    topP: 0.8,
    maxOutputTokens: 2048,
    responseMimeType: 'application/json'  // Forces pure JSON output — no markdown fences
  }
});

// ─── Model for claim VERIFICATION (with Google Search grounding) ─────────────
const verificationModel = genAI.getGenerativeModel({
  model: 'gemini-3.1-flash-lite',
  tools: [{ googleSearch: {} }],          // Native Google Search — free tier supported
  generationConfig: {
    temperature: 0.2,
    topP: 0.85,
    maxOutputTokens: 1024
  }
});

// ─── CLAIM EXTRACTION ────────────────────────────────────────────────────────
export async function extractClaims(pdfText) {
  const prompt = `
You are a precise claim extraction engine. Your only job is to find specific, 
verifiable factual claims in a document.

RULES:
- Extract ONLY claims that contain concrete, checkable facts
- Valid claim types: statistics (%), numbers, dates, financial figures, 
  named-entity facts, technical specs, historical events with dates
- REJECT: opinions, vague statements, predictions, marketing fluff
- Extract between 5 and 20 claims maximum
- Each claim must be a self-contained sentence with enough context to verify it

DOCUMENT TEXT:
${pdfText.slice(0, 10000)}

Return a JSON array. Each item must have exactly these fields:
[
  {
    "id": 1,
    "claim": "The full claim sentence with all context needed to verify it",
    "category": "statistic" | "date" | "financial" | "technical" | "historical"
  }
]

Return ONLY the JSON array. No explanation. No markdown. No extra text.
`;

  const result = await extractionModel.generateContent(prompt);
  const text = result.response.text().trim();

  // responseMimeType: 'application/json' means no fences, but clean anyway
  const cleaned = text.replace(/```json|```/gi, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) throw new Error('Response is not an array');
    return parsed;
  } catch (e) {
    // Fallback: try to extract JSON array from response
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) return JSON.parse(match[0]);
    throw new Error(`Claim extraction failed to parse JSON: ${e.message}`);
  }
}

// ─── CLAIM VERIFICATION (with live Google Search) ────────────────────────────
export async function verifyClaim(claim) {
  const prompt = `
You are a professional fact-checker with access to Google Search. 
Verify the following claim by searching for current, authoritative data.

CLAIM TO VERIFY: "${claim.claim}"
CLAIM TYPE: ${claim.category}

VERIFICATION STEPS:
1. Search Google for the most current and authoritative data on this specific claim
2. Find the actual current figure, date, or fact from a reputable source
3. Compare what you found against what the claim states
4. Make a determination:
   - "verified" = claim matches current data within reasonable margin
   - "inaccurate" = claim is outdated or the number is wrong but close to reality
   - "false" = claim has no evidence, is fabricated, or is completely wrong

RESPONSE FORMAT — return ONLY this JSON object, no explanation before or after:
{
  "status": "verified" | "inaccurate" | "false",
  "explanation": "One clear sentence explaining what you found and why you gave this verdict",
  "corrected_fact": "The accurate, current fact with the real number/date/figure. Only include if status is inaccurate or false, otherwise null",
  "source": "Name of the source you used (e.g. World Bank, Statista, Reuters)",
  "confidence": "high" | "medium" | "low"
}
`;

  const result = await verificationModel.generateContent(prompt);
  const text = result.response.text().trim();

  // Gemini with googleSearch tool may include search metadata — extract just the JSON
  const jsonMatch = text.match(/\{[\s\S]*?\}/);
  if (!jsonMatch) {
    // If Gemini returned plain text instead of JSON, construct a safe fallback
    return {
      status: 'false',
      explanation: 'Verification response was unstructured. Could not parse result.',
      corrected_fact: null,
      source: 'N/A',
      confidence: 'low'
    };
  }

  try {
    const parsed = JSON.parse(jsonMatch[0]);

    // Validate all required fields exist
    const requiredFields = ['status', 'explanation', 'source', 'confidence'];
    for (const field of requiredFields) {
      if (!parsed[field]) parsed[field] = field === 'confidence' ? 'low' : 'Unknown';
    }

    // Validate status is one of the three allowed values
    if (!['verified', 'inaccurate', 'false'].includes(parsed.status)) {
      parsed.status = 'false';
    }

    return parsed;
  } catch (e) {
    throw new Error(`JSON parse failed for claim "${claim.claim}": ${e.message}`);
  }
}
