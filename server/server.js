// Express proxy to forward chat messages to Deepseek (or other LLMs).
// SECURITY: Do NOT hardcode API keys. Set DEEPSEEK_API_KEY in the environment.

const express = require("express");
const fetch = require("node-fetch");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic CORS for local development. Lock this down in production.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// Health / probe and main proxy endpoint
app.post("/api/gemini", async (req, res) => {
  try {
    // Support a simple health probe: { health: true }
    if (req.body && req.body.health) {
      return res.json({ success: true, ok: true });
    }

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const apiUrl =
      process.env.DEEPSEEK_API_URL || "https://api.deepseek.ai/v1/generate";

    // Basic input extraction
    const messages = Array.isArray(req.body && req.body.messages)
      ? req.body.messages
      : [];
    const lastUser = messages
      .slice()
      .reverse()
      .find((m) => m.role === "user");
    const userText = lastUser ? lastUser.content : req.body.prompt || "";

    if (!apiKey) {
      // No key: return an informative error and a mock reply so the frontend keeps working.
      console.warn("DEEPSEEK_API_KEY not set — returning mock reply");
      const mock = `(Mock Deepseek) Received: "${String(
        userText
      )}" — This server is running without a DEEPSEEK_API_KEY. Set the key in your environment to enable real responses.`;
      return res.json({ success: false, error: "no-api-key", reply: mock });
    }

    // Build provider payload. NOTE: adapt to provider's required shape.
    const providerPayload = {
      // This is a generic example — modify according to your provider specification
      input: userText,
      max_tokens: process.env.MAX_TOKENS ? Number(process.env.MAX_TOKENS) : 512,
      temperature: process.env.TEMPERATURE
        ? Number(process.env.TEMPERATURE)
        : 0.7,
    };

    const providerResp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(providerPayload),
      timeout: 20000,
    });

    if (!providerResp.ok) {
      const txt = await providerResp.text();
      console.error("Provider returned non-OK", providerResp.status, txt);
      return res
        .status(502)
        .json({
          success: false,
          error: "provider-error",
          status: providerResp.status,
          body: txt,
        });
    }

    // Try to parse JSON response and extract text. Providers differ — adapt here.
    const data = await providerResp.json();

    // Attempt to find content in common locations
    let reply = null;
    if (typeof data.reply === "string") reply = data.reply;
    if (!reply && data.choices && data.choices[0]) {
      reply = data.choices[0].text || data.choices[0].message || null;
    }
    if (!reply && data.output && data.output[0])
      reply = data.output[0].content || data.output[0];

    // Fallback to stringifying the response
    if (!reply) reply = JSON.stringify(data);

    return res.json({ success: true, reply });
  } catch (err) {
    console.error("Error in /api/gemini:", err);
    return res.status(500).json({ success: false, error: String(err) });
  }
});

// Optionally serve static files (convenience for local development)
app.use(express.static(path.join(__dirname, "..")));

app.listen(port, () => {
  console.log(`Server proxy listening on http://localhost:${port}`);
  console.log(
    "POST /api/gemini will proxy to DEEPSEEK_API_URL when DEEPSEEK_API_KEY is set."
  );
});
