# NoteFlow

AI-powered meeting notes dashboard. Summarize discussions, extract action items, track tasks.

## Stack
- **Client**: React 18, Vite, Tailwind CSS, Framer Motion
- **Server**: Node.js, Express, MongoDB, JWT auth
- **AI**: OpenAI GPT-4o-mini

## Setup

### 1. Clone & install
```bash
git clone https://github.com/bibi231/noteflow.git
cd noteflow
npm install --workspaces
```

### 2. Configure environment
Copy `.env.example` to `.env` in both root and `server/`:
```bash
cp server/.env.example server/.env
```
Fill in: `MONGODB_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, `CLIENT_URL`

### 3. Run
```bash
npm run dev:server   # Express on :5000
npm run dev:client   # Vite on :5173
```

## Deployment
- **Client**: Vercel (static SPA)
- **Server**: Render / Railway (Node.js)
