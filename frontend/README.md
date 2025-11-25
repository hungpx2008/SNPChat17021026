# ChatSNP Frontend

Next.js application for the ChatSNP platform.

## Quick start

```bash
cd frontend
npm install
npm run dev
```

By default the dev server runs at http://localhost:9002. Configure environment variables in `.env.local` (see `.env.local` for current values). The UI expects the FastAPI backend at `NEXT_PUBLIC_BACKEND_URL`.

## Useful scripts

- `npm run dev` – start development server
- `npm run build` / `npm run start` – production build & serve
- `npm run lint` – Next.js lint rules
- `npm run typecheck` – TypeScript in `--noEmit` mode

## Project layout

```
frontend/
├── public/            # static assets
├── src/               # app router, components, hooks, services
├── components.json    # shadcn/ui configuration
├── tailwind.config.ts
├── postcss.config.mjs
└── tsconfig.json
```

The frontend consumes the backend REST API described in `backend/README.md` via the helper in `src/services/chat-backend.ts`.
