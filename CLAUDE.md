# NoteFlow - AI Meeting Dashboard

## Project Identity
- **Name**: NoteFlow
- **Tagline**: "Your meetings, distilled."
- **Stack**: MERN (MongoDB, Express, React, Node.js)
- **Frontend**: React 18 + Vite + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Express.js + MongoDB + Mongoose
- **AI**: OpenAI GPT-4o-mini (summarization + action-item extraction)
- **Auth**: JWT + bcrypt
- **Deployment**: Vercel (client) + Render (API)

---

## Brand Identity

### Colors
```
Primary:     #6C3CE1 (Electric Violet)
Primary-dark:#5429B5
Accent:      #00D4AA (Mint Teal)
Accent-dark: #00B892
Background:  #0A0A0F (Near Black)
Surface:     #141420 (Dark Card)
Surface-2:   #1E1E2E (Elevated Card)
Border:      #2A2A3E (Subtle Border)
Text:        #F5F5F7 (Off White)
Text-muted:  #8E8EA0 (Muted Gray)
Success:     #00D68F
Warning:     #FFB547
Error:       #FF4757
```

### Typography
- **Headings**: `"Plus Jakarta Sans", sans-serif` (weight 600-800)
- **Body**: `"Inter", sans-serif` (weight 400-500)
- **Mono/Code**: `"JetBrains Mono", monospace`

### Design Principles
- Dark-first. Glass morphism cards (backdrop-blur-xl, bg-white/5 borders).
- Generous whitespace. 8px grid system.
- Micro-interactions on every interactive element (Framer Motion, 200-300ms).
- Gradient accents: `bg-gradient-to-r from-[#6C3CE1] to-[#00D4AA]` for CTAs and highlights.
- No stock illustrations. Use abstract geometric shapes and subtle grid patterns.
- Inspiration: Linear, Raycast, Vercel dashboard, Arc browser.

---

## Architecture

```
noteflow/
  client/                 # React + Vite
    src/
      components/
        ui/               # shadcn/ui primitives
        layout/           # Sidebar, Header, PageWrapper
        meeting/          # MeetingCard, MeetingDetail, NoteEditor
        dashboard/        # StatsGrid, RecentMeetings, ActionItemList
        common/           # LoadingSpinner, EmptyState, Toast
      pages/
        Dashboard.jsx
        Meetings.jsx
        MeetingDetail.jsx
        Settings.jsx
        Login.jsx
        Register.jsx
      hooks/              # useAuth, useMeetings, useAI
      lib/                # api.js, utils.js, cn.js
      context/            # AuthContext.jsx
      styles/
        globals.css       # Tailwind + custom properties
    index.html
    vite.config.js
    tailwind.config.js
  server/
    src/
      routes/             # auth.js, meetings.js, ai.js
      models/             # User.js, Meeting.js
      middleware/         # auth.js, errorHandler.js, rateLimit.js
      services/           # aiService.js (OpenAI integration)
      utils/              # validators.js
    server.js
  .env.example
  package.json            # Root workspace
```

---

## Data Models

### User
```js
{ name, email, password(hashed), avatar, plan: "free"|"pro", createdAt }
```

### Meeting
```js
{
  userId (ref User),
  title,
  date,
  rawNotes: String,         // Original pasted/typed notes
  summary: String,          // AI-generated summary
  actionItems: [{
    text: String,
    assignee: String,
    dueDate: Date,
    status: "pending"|"in_progress"|"done",
    priority: "low"|"medium"|"high"
  }],
  tags: [String],
  status: "draft"|"processed",
  createdAt, updatedAt
}
```

---

## API Routes

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/meetings
POST   /api/meetings
GET    /api/meetings/:id
PUT    /api/meetings/:id
DELETE /api/meetings/:id

POST   /api/ai/summarize     { meetingId }
POST   /api/ai/extract       { meetingId }
```

---

## AI Prompts (Server-side)

### Summarize
```
System: You are a meeting summarizer. Output a concise 3-5 bullet summary capturing key decisions, discussion points, and outcomes. No fluff.
User: <raw meeting notes>
```

### Extract Action Items
```
System: Extract action items from meeting notes. Return JSON array: [{text, assignee (or "Unassigned"), priority: "low"|"medium"|"high", suggestedDueDate}]. Be precise. Only include real action items, not discussion points.
User: <raw meeting notes>
```

---

## UI Components to Use from 21st.dev / shadcn

Install via `npx shadcn@latest add <component>`:
- button, input, textarea, card, badge, avatar
- dialog, dropdown-menu, tabs, tooltip
- separator, skeleton, toast (sonner)
- sidebar (for app navigation)

From 21st.dev community, look for:
- Animated gradient borders
- Glass card components
- Stat cards with sparklines
- Kanban-style task boards
- Empty state illustrations

---

## Key Pages

### 1. Dashboard (/)
- Greeting + date
- Stats row: Total Meetings | Action Items | Completed | Pending
- Recent Meetings list (last 5, cards with status badges)
- Quick "New Meeting" CTA

### 2. Meetings (/meetings)
- Search + filter bar (by date, tag, status)
- Grid/List toggle
- Meeting cards with summary preview

### 3. Meeting Detail (/meetings/:id)
- Split layout: Notes (left) | AI Output (right)
- "Summarize" and "Extract Actions" buttons with loading animations
- Action items as interactive checklist
- Edit inline

### 4. Auth (/login, /register)
- Centered card, gradient background
- Social-style buttons (but email/password only for now)

---

## Security Checklist
- [ ] bcrypt password hashing (12 rounds)
- [ ] JWT with httpOnly cookies (not localStorage)
- [ ] Rate limiting on auth routes (5 req/min)
- [ ] Input sanitization (express-validator + mongo-sanitize)
- [ ] CORS whitelist (only client domain)
- [ ] Helmet.js headers
- [ ] Environment variables for all secrets
- [ ] No sensitive data in client bundle

---

## Behavioral Rules (Karpathy-derived)

1. **Think Before Coding** - State assumptions. If multiple approaches exist, present them. Ask if unclear.
2. **Simplicity First** - Minimum code that works. No speculative features. No over-abstraction.
3. **Surgical Changes** - Touch only what the task requires. Match existing style.
4. **Goal-Driven** - Define success criteria before implementing. Verify after.

## Token Efficiency Rules

- Answer first, reasoning after. No preamble.
- No "Sure!", "Great question!", "Certainly!".
- No restating the prompt. Execute immediately.
- Structured output: bullets, code blocks. Prose only when asked.
- Every sentence earns its place. No redundant context.
- Short responses unless depth requested.
- No unsolicited suggestions beyond the ask.

## Code Standards

- Read before edit. Never modify blind.
- No docstrings on unchanged code.
- Comments only where logic is non-obvious.
- No abstractions for single-use code.
- Remove only orphans YOUR changes created.
- Run `npm run lint` before committing.

---

## .claudeignore
```
node_modules/
dist/
.env
*.lock
```

---

## Dev Commands
```bash
# Install
npm install           # root
cd client && npm install
cd server && npm install

# Dev
cd client && npm run dev     # Vite dev server :5173
cd server && npm run dev     # nodemon :5000

# Build
cd client && npm run build
```

## Environment Variables
```
# server/.env
MONGODB_URI=
JWT_SECRET=
OPENAI_API_KEY=
CLIENT_URL=http://localhost:5173
PORT=5000

# client/.env
VITE_API_URL=http://localhost:5000/api
```
