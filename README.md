# Queue Service Console

An administrative dashboard and developer console for controlling, monitoring, and debugging the **Queue Service** background job engine. It gives real-time visibility into BullMQ queues, worker processing states, delivery logs, dead-letter queues (DLQ), and API key management.

---

## Features

- **System Overview & Metrics:** Real-time polling (every 5 seconds) for job stats, backlog state, live email queue metrics, and channel success/failure rates visualized with Recharts.
- **Jobs Queue Workspace:** Cursor-paginated notification jobs table with status filters (`pending`, `processing`, `completed`, `failed`, `dead`), an execution inspection drawer, and delivery attempt timelines.
- **Interactive Dispatcher:** Test job dispatcher modal to enqueue email and webhook notifications using API keys directly from the browser.
- **Dead Letter Queue (DLQ) Inspector:** Analyze exhausted retry jobs, inspect error stack traces side-by-side with original JSON payloads, and trigger one-click job replays or record purges.
- **API Key Management:** Generate `qs_...` API keys with one-time copy modals and revoke active tokens.
- **User Authentication:** Complete auth flow with account registration, email OTP verification, JWT session management via HttpOnly cookies, password resets, and account deletion.
- **Developer-Centric UI:** Styled with `shadcn/ui` using the `Lyra` Phosphor preset and `JetBrains Mono` typography for a terminal-like console experience.

---

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling & UI:** Tailwind CSS v4 + shadcn/ui (Base UI, Lyra Phosphor, JetBrains Mono)
- **Data Fetching & State:** TanStack React Query v5 + Axios (with credentials)
- **Routing:** React Router v7
- **Charts:** Recharts
- **Icons & Dates:** Lucide React & date-fns

---

## Getting Started

### Prerequisites

- **Node.js:** v18.0.0 or higher
- **pnpm:** v8.0.0 or higher
- **Backend API:** the [Queue Service backend](https://github.com/owaisahmadshah/queue-service) running on `http://localhost:3030`

### Installation

1. **Clone the repository:**

   ```bash
   git clone --depth 1 https://github.com/owaisahmadshah/queue-service-client.git
   cd queue-service-client
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3030/api/v1
   ```

4. **Start the development server:**

   ```bash
   pnpm dev
   ```

---

## Folder Structure

```text
queue-service-client/
├── src/
│   ├── components/
│   │   ├── modals/          # Dispatch, API key creation, and DLQ drawers
│   │   ├── shared/          # AppSidebar, Navbar, PageHeader, StatusBadge, CodeBlock
│   │   └── ui/              # shadcn/ui primitive components
│   ├── config/              # Environment vars & polling constants
│   ├── contexts/            # AuthContext provider
│   ├── lib/                 # Axios client, query client, and utility helpers
│   ├── pages/
│   │   ├── auth/            # Sign in, Sign up, OTP verification, Reset password
│   │   └── dashboard/       # Overview, Jobs, DLQ, API Keys, Settings
│   ├── routes/              # Protected & Guest route guards and router registry
│   ├── services/            # API service layers
│   └── types/               # TypeScript domain interfaces
├── package.json
└── vite.config.ts
```
