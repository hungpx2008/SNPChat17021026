# ChatSNP Project Exploration - Index

**Generated**: 2026-04-15  
**Project**: ChatSNP v0.1.0  
**Location**: `/Volumes/orical/ChatSNP/chatSNP170226/`

## 📚 Documentation Files Created

### 1. **CHATSNP_PROJECT_EXPLORATION.md** (Comprehensive)
- **Size**: ~500 lines
- **Purpose**: Complete project overview
- **Contains**:
  - Docker services breakdown (10 services)
  - Environment variables (all 6 sections)
  - Frontend package.json analysis
  - Backend pyproject.toml dependencies
  - Architecture diagrams
  - AI/ML agent modes explanation
  - Quick start commands
  - Port mapping
  - Security notes
  - File structure

**When to read**: Need detailed understanding of all components

---

### 2. **CHATSNP_QUICK_REFERENCE.md** (At-a-Glance)
- **Size**: ~200 lines
- **Purpose**: Fast lookup reference
- **Contains**:
  - Architecture diagram
  - Services comparison table
  - Command cheatsheet
  - API endpoints
  - Port allocation
  - Security checklist
  - Agent modes (3 ways to query)
  - Configuration profiles

**When to read**: Need quick answers during development

---

### 3. **DOCKER_COMPOSE_ANALYSIS.md** (In-Depth)
- **Size**: ~400 lines
- **Purpose**: Detailed Docker configuration guide
- **Contains**:
  - Dev vs Pro comparison
  - Each service explained (postgres, redis, qdrant, backend, frontend, workers)
  - Volume management
  - Dependency flow diagram
  - Environment variable inheritance
  - Performance optimization tips
  - Common issues & solutions
  - Deployment checklist

**When to read**: Troubleshooting containers, optimizing performance, deploying

---

## 🎯 Quick Start by Role

### I'm a **Frontend Developer**
1. Read: **CHATSNP_QUICK_REFERENCE.md** (sections: Architecture, Frontend Stack, Commands)
2. Read: **DOCKER_COMPOSE_ANALYSIS.md** (section: FRONTEND Frontend Service)
3. Run: `docker compose --env-file .env up -d --build && docker compose logs -f frontend`

### I'm a **Backend Developer**
1. Read: **CHATSNP_QUICK_REFERENCE.md** (sections: Backend Stack, API Endpoints)
2. Read: **DOCKER_COMPOSE_ANALYSIS.md** (sections: BACKEND, Worker Services)
3. Run: `docker compose --env-file .env up -d --build && docker compose logs -f backend`

### I'm a **DevOps/Infrastructure**
1. Read: **DOCKER_COMPOSE_ANALYSIS.md** (entire document)
2. Read: **CHATSNP_PROJECT_EXPLORATION.md** (section: Ports & Security)
3. Check: Production config → `docker-compose.pro.yml`

### I'm **Deploying to Production**
1. Read: **DOCKER_COMPOSE_ANALYSIS.md** (sections: Production Profile, Deployment Checklist)
2. Update: `.env` with production secrets
3. Run: `docker compose -f docker-compose.pro.yml --env-file .env up -d --build`

### I'm **Debugging an Issue**
1. Identify service: frontend, backend, postgres, redis, qdrant, or workers?
2. Check: **DOCKER_COMPOSE_ANALYSIS.md** → "Common Issues & Solutions" section
3. View logs: `docker compose logs -f [service_name]`
4. Monitor: Flower at http://localhost:5555 (if celery issue)

---

## 🔍 Key Findings Summary

### Services (10 total)
- ✅ **Data Layer**: PostgreSQL (16), Redis (7-alpine), Qdrant (latest)
- ✅ **Application**: Backend (FastAPI), Frontend (Next.js 15)
- ✅ **Workers**: 3 Celery workers + Flower monitoring
- ✅ **Tunneling**: Cloudflare tunnel (dev only)

### Technology Stack
- **Frontend**: Next.js 15 + React 18 + shadcn/ui + Tailwind
- **Backend**: FastAPI + SQLAlchemy + Celery
- **Database**: PostgreSQL 16 + Redis 7 + Qdrant
- **AI/ML**: OpenRouter (gpt-4o-mini) + Vanna + Sentence Transformers
- **Search**: Whoosh (BM25) + Qdrant (vectors)
- **Media**: Docling (parsing) + PaddleOCR + Faster Whisper

### Critical Ports
| Port | Service | Use |
|------|---------|-----|
| 3000 | Frontend | Access UI |
| 8000 | Backend API | API calls |
| 5555 | Flower | Monitor tasks |
| 6379 | Redis | Cache/Queue |
| 6333 | Qdrant | Vectors |
| 5432 | PostgreSQL | Database |

### Environment Setup
- `.env` (production secrets) - DO NOT COMMIT
- `.env.example` (template) - safe to share
- 6 main categories: DB, Redis, Qdrant, Backend, AI Services, Frontend

### Key Configuration Difference: Dev vs Pro
| Aspect | Dev | Pro |
|--------|-----|-----|
| Healthchecks | ✅ On | ❌ Off |
| Cloudflared | ✅ On | ❌ Off |
| OCR | ❌ Off | ✅ On |
| Backend URL | localhost:8000 | https://domain.online |
| Turbopack | ✅ On | ❌ Off |

---

## 🚀 Essential Commands

```bash
cd /Volumes/orical/ChatSNP/chatSNP170226

# Development
docker compose --env-file .env up -d --build

# View status
docker compose ps

# Logs
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f worker_chat

# Stop
docker compose down

# Production
docker compose -f docker-compose.pro.yml --env-file .env up -d --build

# Monitoring
open http://localhost:3000      # Frontend
open http://localhost:8000      # Backend API
open http://localhost:5555      # Celery Flower
open http://localhost:6333      # Qdrant
```

---

## 📋 Files Reference

### Docker Configurations
- `docker-compose.yml` - Development (recommended for local work)
- `docker-compose.pro.yml` - Production optimized
- `docker-compose.prod.yml` - Alternative production
- `docker-compose.full.yml` - Minimal setup

### Environment
- `.env` - Production secrets (DO NOT COMMIT) ⚠️
- `.env.example` - Template (safe to share)
- `.env.production` - Production config
- `.env.databases` - Database config

### Source Code
- `backend/pyproject.toml` - Python dependencies
- `backend/Dockerfile` - Python image build
- `frontend/package.json` - Node dependencies
- `frontend/Dockerfile` - Node image build

### Documentation (in project root)
- `CLAUDE.md` - Project rules & GSD commands
- `PROJECT_CONTEXT.md` - Full project map
- `README.md` - Basic overview
- `.planning/codebase/` - Deep technical docs

---

## 🔐 Security Checklist

**IMMEDIATE ACTION REQUIRED**:
- [ ] `.env` has production secrets - Keep secure!
- [ ] PostgreSQL default password: `12345678` - Change ASAP!
- [ ] OpenRouter API key visible - Rotate if exposed!
- [ ] No JWT auth yet - Implement before production

**Before Production Deployment**:
- [ ] Update PostgreSQL password
- [ ] Rotate API keys
- [ ] Configure CORS for production domain
- [ ] Enable HTTPS/SSL
- [ ] Setup secrets manager
- [ ] Implement JWT authentication
- [ ] Configure backup & disaster recovery

---

## 🤔 FAQ

**Q: How do I start development?**  
A: `docker compose --env-file .env up -d --build`

**Q: Where are the API docs?**  
A: http://localhost:8000/docs (FastAPI Swagger UI)

**Q: How do I monitor Celery tasks?**  
A: http://localhost:5555 (Flower UI)

**Q: How do I test the backend?**  
A: `cd backend && pytest`

**Q: Where are document uploads stored?**  
A: Docker volume `media-data` (mounted at `/app/media`)

**Q: How does RAG work?**  
A: Document → Docling parsing → Chunk → Embed → Qdrant + BM25 index

**Q: What's the difference between dev and pro configs?**  
A: See **DOCKER_COMPOSE_ANALYSIS.md** → Dev vs Pro comparison table

**Q: How do I deploy to production?**  
A: See **DOCKER_COMPOSE_ANALYSIS.md** → Deployment Checklist

---

## 📞 Need Help?

1. **General questions**: Check **CHATSNP_QUICK_REFERENCE.md**
2. **Docker issues**: Check **DOCKER_COMPOSE_ANALYSIS.md** → Common Issues section
3. **Architecture questions**: Check **CHATSNP_PROJECT_EXPLORATION.md**
4. **Project rules**: Check **CLAUDE.md**
5. **Technical deep dive**: Check `.planning/codebase/` directory

---

## 📅 Version History

| Date | Update |
|------|--------|
| 2026-04-15 | Initial exploration & documentation |
| — | — |

---

**Status**: ✅ Ready for development  
**Maintained by**: ChatSNP Team  
**Last Updated**: 2026-04-15

