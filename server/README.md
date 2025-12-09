Deepseek proxy for Aethyra frontend

This Express server proxies requests from the frontend (`/api/gemini`) to a Deepseek (or other LLM) API. It keeps your API key out of the browser by reading it from `process.env.DEEPSEEK_API_KEY`.

Quick start (local development)

1. Install dependencies

```bash
cd server
npm install
```

2. Run with your API key (do NOT commit the key)

```bash
# temporary for one run
DEEPSEEK_API_KEY="sk-..." npm start

# or export for the session
export DEEPSEEK_API_KEY="sk-..."
npm start
```

3. The frontend already calls `/api/gemini` by default. If you run the server on port 3000 and open the site from `http://localhost:3000/Pages/landingPage.html`, the chatbot will use the proxy.

Configuration

- `DEEPSEEK_API_URL` (optional): set to the provider HTTP endpoint, default is `https://api.deepseek.ai/v1/generate` (replace with your provider's real endpoint if different).
- `MAX_TOKENS`, `TEMPERATURE`: optional numeric env vars to tweak provider request.

Security notes

- DO NOT paste API keys in chat, commit them, or store them in source files. You shared a key in chat — if that was a real secret, rotate/regenerate it immediately and treat it as compromised.
- For production, secure this proxy (restrict origins, add auth, rate-limiting, TLS).

Provider compatibility

- The proxy attempts to map common response shapes (`reply`, `choices`, `output`). Depending on your provider's response format you may want to adapt `server.js` to extract the desired text field.

If you want, I can:

- Implement provider-specific request payloads for Deepseek if you share the exact API spec (I will not accept the key here).
- Add simple logging or usage limits to the proxy.
