# Waldseilgarten CRM - Master Umsetzungsplan

**Projekt:** Waldseilgarten Herrenberg CRM
**Status:** Teilweise funktional → Revamp & Vervollständigung
**Zielserver:** waldseilgarten (85.199.86.188)
**Erstellt:** 2026-05-10
**Ausführung:** OpenCode auf Zielserver

---

## 🎯 Planungsmethodik (Multi-Layer)

Dieser Plan kombiniert alle unsere bewährten Techniken:

1. **TDD (Technical Design Document)** → Architektur & API-Design
2. **User Stories (Jobs-to-be-done)** → Anforderungen & Akzeptanzkriterien
3. **AI Council Review** → Kritische Review & Stabilisierung
4. **Phasen-Planung** → Inkrementelle Umsetzung
5. **OpenCode Execution** → Ausführung auf Zielserver

---

## 📋 IST-Analyse (Aktueller Stand)

### ✅ Was existiert bereits

| Komponente | Status | Details |
|------------|--------|---------|
| Backend (NestJS) | 🟡 Teilweise | Auth, Customers, Documents existieren |
| Frontend (React) | 🟡 Teilweise | Alle Pages vorhanden, Integration unklar |
| API-Doku | 🟢 Vorhanden | Swagger unter `/api/docs` |
| Container | 🟡 Existieren | Podman-Compose vorhanden, Created state |
| Datenbank | 🟡 Schema existiert | PostgreSQL mit TypeORM Entities |

### ❌ Was fehlt/unklar

- Tests (fehlen weitgehend)
- Error Handling (unvollständig)
- Frontend-API Integration (Status unklar)
- IMAP-Integration (Code existiert?)
- Dokumenten-Upload (funktioniert?)
- Security Hardening

---

## 🏗️ Architektur (Bestätigt)

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                               │
│                   (React + Vite)                            │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼─────────────────────────────────────┐
│                     Traefik                                 │
│              (Reverse Proxy + SSL)                          │
└───────────────────────┬─────────────────────────────────────┘
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Frontend    │ │   Backend    │ │   Worker     │
│   (nginx)    │ │  (NestJS)    │ │  (IMAP)      │
│   :3000      │ │   :3001      │ │              │
└──────────────┘ └──────┬───────┘ └──────────────┘
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │    Redis     │ │    Local     │
│   (DB)       │ │   (Cache)    │ │   Storage    │
│   :5432      │ │   :6379      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Tech Stack:**
- Backend: NestJS (Node.js 22) + TypeORM + PostgreSQL 18 + Redis 7
- Frontend: React 19 + Vite + shadcn/ui + Tailwind CSS + Zustand + TanStack Query
- DevOps: Podman + Traefik + Let's Encrypt

---

## 📊 Phasen-Planung (6 Phasen)

### Phase 0: Stabilisierung (Woche 1)
**Ziel:** Fundament stabilisieren, technische Schulden abbauen

| Aufgabe | Zeit | Akzeptanzkriterien |
|---------|------|-------------------|
| Health Check Endpoint | 2h | `GET /health` → 200, DB/Redis/Storage geprüft |
| Global Error Handling | 4h | Alle Errors abgefangen, standardisiertes Format |
| Rate Limiting | 2h | `@nestjs/throttler` installiert, Auth: 5req/min |
| Logging (Winston) | 2h | Strukturierte Logs, Rotation, Request-ID |
| Unit Tests Auth | 4h | ≥70% Coverage für Auth |
| E2E Tests API | 4h | Login + Customer CRUD getestet |

**Definition of Done:**
- `npm run test` läuft erfolgreich
- `npm run test:cov` ≥ 70%
- `curl http://localhost:3001/health` gibt 200
- Keine Lint-Fehler

---

### Phase 1: Core Features (Woche 2)
**Ziel:** MVP-Ready mit Customer Management & Document Upload

| Aufgabe | Zeit | Akzeptanzkriterien |
|---------|------|-------------------|
| Customer CRUD vervollständigen | 1 Tag | Pagination, Suche, Soft Delete, Tests |
| Document Upload implementieren | 2 Tage | Multer, UUID-Namen, 50MB Limit, Download |
| Frontend-API Integration | 1 Tag | Keine CORS Errors, Token-Handling stabil |
| Security Fixes | 1-2 Tage | JWT Secret aus Code, CORS Whitelist, Input Sanitization |
| Production Deployment | 1-2 Tage | Domain + SSL, `.env.production`, Migrations |

**Definition of Done:**
- Customer CRUD 100% funktional
- Document Upload/Download funktioniert
- Test Coverage ≥ 80%
- CRM live auf Domain mit HTTPS

---

### Phase 2: Dokumentenverwaltung (Woche 3)
**Ziel:** Vollständiges Document Management

| User Story | SP | Akzeptanzkriterien |
|------------|----|-------------------|
| US-401: Dokumente hochladen | 5 | Drag & Drop, Multi-Upload, Fortschritt, 50MB |
| US-402: Dokumente herunterladen | 3 | Einzeln + ZIP, Vorschau, Tracking |
| US-403: Dokumente versionieren | 5 | Neue Version, Historie, Rollback |

**Technisch:**
- Local Storage Service (Abstraktion für SeaDrive-Switch)
- Document Entity erweitern (versions, metadata)
- Frontend: Upload Component + Document List

---

### Phase 3: Aufgabenmanagement (Woche 4)
**Ziel:** Task-Management & Kanban-Board

| User Story | SP | Akzeptanzkriterien |
|------------|----|-------------------|
| US-501: Aufgaben erstellen | 5 | Titel, Beschreibung, Fälligkeit, Priorität, Zuweisung |
| US-502: Aufgaben erledigen | 3 | Checkbox, Datum, Wer, Kommentar |
| US-503: Kanban-Board | 8 | Spalten, Drag & Drop, Filter, Farbcodierung |

**Technisch:**
- Task Entity + Service + Controller
- Project-Task Relation
- Kanban Component (react-beautiful-dnd oder @dnd-kit)

---

### Phase 4: E-Mail-Integration (Woche 5-6)
**Ziel:** IMAP-Integration mit automatischem Import

| User Story | SP | Akzeptanzkriterien |
|------------|----|-------------------|
| US-601: IMAP-Postfach verbinden | 8 | Server/Port/SSL, Test-Verbindung, 15min Sync |
| US-602: E-Mails anzeigen | 5 | Absender, Betreff, HTML/Text, Anhänge |
| US-603: E-Mails zuordnen | 5 | Manuell + Auto-Vorschläge, Mehrfach-Zuordnung |

**Technisch:**
- IMAP Service (node-imap)
- Background Worker (Bull Queue + Redis)
- Email Entity + Parser
- Circuit Breaker für IMAP-Verbindung

---

### Phase 5: Erweiterungen (Woche 7-9)
**Ziel:** Google Calendar, Reporting, SeaDrive

| User Story | SP | Akzeptanzkriterien |
|------------|----|-------------------|
| US-701: Google Calendar Sync | 8 | OAuth, Zwei-Wege, Projekt-Termine |
| US-702: Berichte exportieren | 5 | PDF, Zeitraum, Logo/Branding |
| US-703: SeaDrive Sync | 13 | Account verbinden, Ordner sync, Konflikt-Resolution |

**Priorität:** COULD (nur wenn Zeit/Budget)

---

## 🔒 Security Hardening (Über alle Phasen)

### Kritische Maßnahmen (Phase 0-1)

| Maßnahme | Priorität | Umsetzung |
|----------|-----------|-----------|
| JWT Secret aus Code entfernen | 🔴 Kritisch | `.env` + `.env.example` bereinigen |
| CORS explizit whitelisten | 🔴 Kritisch | Nur `https://waldseilgarten-herrenberg.de` |
| Rate Limiting | 🔴 Kritisch | `@nestjs/throttler`, Auth: 5/15min |
| Input Sanitization | 🟡 Hoch | `class-sanitizer`, DOMPurify |
| Audit Logging | 🟡 Hoch | Wer hat wann was gemacht |
| SQL Injection Prevention | 🟡 Hoch | TypeORM parameterized queries |
| XSS Prevention | 🟡 Hoch | React escaping + CSP Headers |

---

## 🧪 Test-Strategie

### Test-Pyramide

```
        /\
       /  \
      / E2E \      ← Playwright (Kritische Flows)
     /________\
    /          \
   / Integration \  ← Supertest (API Endpunkte)
  /______________\
 /                \
/     Unit Tests   \ ← Jest (Services, Utils)
/____________________\
```

### Coverage-Ziele

| Ebene | Ziel | Werkzeug |
|-------|------|----------|
| Unit | ≥80% | Jest |
| Integration | ≥70% | Supertest |
| E2E | Kritische Flows | Playwright |

### Test-Daten
- Test-Datenbank (separate DB oder Transactions)
- Fixtures für Customers, Projects, Users
- Mock für IMAP (Phase 4)

---

## 📦 Deployment-Strategie

### Container-Setup (Podman)

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:18-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - ./data/db:/var/lib/postgresql/data
    networks:
      - crm-network

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - ./data/redis:/data
    networks:
      - crm-network

  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      POSTGRES_HOST: postgres
      REDIS_HOST: redis
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.crm-api.rule=Host(`api.waldseilgarten-herrenberg.de`)"
    networks:
      - crm-network

  frontend:
    build: ./frontend
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.crm-frontend.rule=Host(`waldseilgarten-herrenberg.de`)"
    networks:
      - crm-network

  worker:
    build: ./backend
    command: npm run worker
    environment:
      NODE_ENV: production
      POSTGRES_HOST: postgres
      REDIS_HOST: redis
    networks:
      - crm-network

networks:
  crm-network:
    driver: bridge
```

### Traefik-Konfiguration

```yaml
# traefik/dynamic/crm.yml
http:
  routers:
    crm-api:
      rule: "Host(`api.waldseilgarten-herrenberg.de`)"
      service: crm-api
      entryPoints:
        - websecure
      tls:
        certResolver: le
    
    crm-frontend:
      rule: "Host(`waldseilgarten-herrenberg.de`)"
      service: crm-frontend
      entryPoints:
        - websecure
      tls:
        certResolver: le

  services:
    crm-api:
      loadBalancer:
        servers:
          - url: "http://waldseilgarten-backend:3001"
    
    crm-frontend:
      loadBalancer:
        servers:
          - url: "http://waldseilgarten-frontend:3000"
```

---

## 📁 Datenbank-Schema (Vollständig)

### Phase 1 (Foundation)

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    website VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address TEXT,
    notes TEXT,
    tags TEXT[],
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP  -- Soft Delete
);

-- Contacts
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    position VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'new',
    priority VARCHAR(20) DEFAULT 'medium',
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Project Members
CREATE TABLE project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);
```

### Phase 2-5 (Erweiterungen)

```sql
-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    uploaded_by UUID REFERENCES users(id),
    version INTEGER DEFAULT 1,
    previous_version_id UUID REFERENCES documents(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'open',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date DATE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    completed_at TIMESTAMP,
    completed_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Emails
CREATE TABLE emails (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id VARCHAR(500) UNIQUE,  -- IMAP Message ID
    subject VARCHAR(500),
    from_address VARCHAR(255),
    to_addresses TEXT[],
    body_text TEXT,
    body_html TEXT,
    received_at TIMESTAMP,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Email Attachments
CREATE TABLE email_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_id UUID REFERENCES emails(id) ON DELETE CASCADE,
    filename VARCHAR(255),
    storage_path VARCHAR(500),
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES users(id),
    resource_type VARCHAR(50),  -- 'customer', 'project', etc.
    resource_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔄 OpenCode Ausführungsplan

### Voraussetzungen auf Zielserver

```bash
# SSH Verbindung
ssh b0rbor4d@85.199.86.188

# Projektverzeichnis
cd ~/projects/waldseilgarten-crm

# Node.js 22 (falls nicht vorhanden)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Podman (falls nicht vorhanden)
sudo apt-get install -y podman podman-compose

# Git (falls nicht vorhanden)
sudo apt-get install -y git
```

### OpenCode Task-Struktur

```
# Für jede Phase wird ein OpenCode Task erstellt:

Phase 0: Stabilisierung
├── Task 0.1: Health Check Endpoint
├── Task 0.2: Global Error Handling
├── Task 0.3: Rate Limiting
├── Task 0.4: Logging (Winston)
├── Task 0.5: Unit Tests Auth
└── Task 0.6: E2E Tests API

Phase 1: Core Features
├── Task 1.1: Customer CRUD vervollständigen
├── Task 1.2: Document Upload implementieren
├── Task 1.3: Frontend-API Integration
├── Task 1.4: Security Fixes
└── Task 1.5: Production Deployment

Phase 2-5: Folgen analog
```

### OpenCode Task-Template

```json
{
  "task": "Waldseilgarten CRM - Phase X.Y: [Name]",
  "server": "waldseilgarten (85.199.86.188)",
  "path": "~/projects/waldseilgarten-crm",
  "requirements": [
    "Node.js 22",
    "Podman",
    "PostgreSQL 18",
    "Redis 7"
  ],
  "acceptance_criteria": [
    "..."
  ],
  "tests": [
    "npm run test",
    "npm run test:cov",
    "curl http://localhost:3001/health"
  ],
  "references": [
    "~/projects/waldseilgarten-crm/docs/TDD.md",
    "~/projects/waldseilgarten-crm/docs/USER_STORIES.md",
    "~/projects/waldseilgarten-crm/docs/ARCHITECTURE.md"
  ]
}
```

---

## 📊 Erfolgskriterien & KPIs

### Gesamtprojekt

| Kriterium | Ziel | Messung |
|-----------|------|---------|
| **Funktionalität** | Alle MUST-Features | User Story Akzeptanzkriterien |
| **Test Coverage** | ≥80% Backend | `npm run test:cov` |
| **Performance** | API <200ms (p95) | Load Testing |
| **Security** | Keine kritischen Issues | Security Audit |
| **Verfügbarkeit** | 99.9% Uptime | Monitoring |
| **Dokumentation** | Vollständig | README + API Docs |

### Phasen-Meilensteine

| Phase | Dauer | Deliverable | Go/No-Go |
|-------|-------|-------------|----------|
| 0 | 1 Woche | Stabilisiertes Fundament | Tests ≥70% |
| 1 | 1 Woche | MVP (Customer + Documents) | Live auf Domain |
| 2 | 1 Woche | Document Management | Upload/Download/Versions |
| 3 | 1 Woche | Task Management | Kanban funktioniert |
| 4 | 2 Wochen | E-Mail Integration | IMAP Sync läuft |
| 5 | 2-3 Wochen | Erweiterungen | Calendar + Reporting |

---

## 🚨 Risiken & Mitigation

| Risiko | Wahrscheinlichkeit | Impact | Mitigation |
|--------|-------------------|--------|------------|
| IMAP-Integration komplex | Hoch | Mittel | Frühes POC, Circuit Breaker |
| Frontend-API Mismatch | Mittel | Mittel | Swagger nutzen, früh testen |
| SeaDrive-Kompatibilität | Mittel | Mittel | Fallback zu Local Storage |
| Performance bei vielen Dokumenten | Mittel | Hoch | Pagination, Lazy Loading |
| SSL-Zertifikat Issues | Niedrig | Mittel | Traefik Let's Encrypt |
| File Storage Permissions | Mittel | Mittel | Podman Volume Rights |

---

## 📚 Referenzen

### Lokale Dokumentation
- `~/data/workspace/projects/waldseilgarten-herrenberg-crm/docs/TDD.md`
- `~/data/workspace/projects/waldseilgarten-herrenberg-crm/docs/USER_STORIES.md`
- `~/data/workspace/projects/waldseilgarten-herrenberg-crm/docs/ARCHITECTURE.md`
- `~/data/workspace/projects/waldseilgarten-herrenberg-crm/docs/AI_COUNCIL_REVIEW_REVAMP.md`

### Server Code
- `~/projects/waldseilgarten-crm/backend/`
- `~/projects/waldseilgarten-crm/frontend/`
- `~/projects/waldseilgarten-crm/docker-compose.yml`

### Externe Ressourcen
- NestJS Docs: https://docs.nestjs.com
- TypeORM Docs: https://typeorm.io
- shadcn/ui: https://ui.shadcn.com

---

## ✅ Nächste Schritte

1. **Diesen Plan auf Zielserver kopieren**
   ```bash
   scp ~/data/workspace/projects/waldseilgarten-herrenberg-crm/docs/MASTER_PLAN.md \
       b0rbor4d@85.199.86.188:~/projects/waldseilgarten-crm/docs/
   ```

2. **OpenCode einrichten** (falls nicht vorhanden)
   ```bash
   # Auf waldseilgarten
   npm install -g @opencode/cli
   # oder
   curl -fsSL https://opencode.ai/install.sh | sh
   ```

3. **Phase 0 starten**
   ```bash
   cd ~/projects/waldseilgarten-crm
   opencode run "Phase 0.1: Health Check Endpoint implementieren"
   ```

4. **Nach jeder Phase:** Review & Go/No-Go Entscheidung

---

**Ende Master Umsetzungsplan**

*Erstellt von: Henry (AI-Assistent)*
*Datum: 2026-05-10*
*Version: 1.0*
