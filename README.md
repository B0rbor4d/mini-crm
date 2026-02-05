# Waldseilgarten CRM - MVP Phase 1

## Projekt-Struktur

```
~/projects/waldseilgarten-crm/
├── backend/              # NestJS API
├── frontend/             # React SPA
├── worker/               # Background Jobs (IMAP)
├── data/                 # Persistent Volumes
│   ├── db/              # PostgreSQL Daten
│   ├── redis/           # Redis Daten
│   └── uploads/         # Dokumente
│       └── documents/
├── docs/                # Dokumentation
├── docker-compose.yml   # Podman Compose
└── .env                 # Umgebungsvariablen
```

## Schnellstart

```bash
# Container starten
cd ~/projects/waldseilgarten-crm
podman-compose up -d

# Logs anzeigen
podman-compose logs -f

# Datenbank-Migrationen ausführen
cd backend && npm run migration:run
```

## Services

| Service | URL | Beschreibung |
|---------|-----|--------------|
| Frontend | http://localhost:3000 | React App |
| Backend API | http://localhost:3001 | NestJS API |
| API Docs | http://localhost:3001/api/docs | Swagger UI |
| PostgreSQL | localhost:5432 | Datenbank |
| Redis | localhost:6379 | Cache |

## Phase 1 Features

- [x] User Authentication (Login/Register)
- [x] Kundenverwaltung (CRUD)
- [x] Projektmanagement (CRUD)
- [x] Dashboard mit Statistiken

## Technologien

- **Backend:** NestJS 11, TypeORM, PostgreSQL 18, Redis 7
- **Frontend:** React 19, TypeScript, TanStack Query, Tailwind
- **Container:** Podman, Traefik

## Datenpersistenz

Alle Daten werden in `./data/` gespeichert:
- `./data/db/` - PostgreSQL Datenbank
- `./data/redis/` - Redis Cache
- `./data/uploads/documents/` - Hochgeladene Dokumente

## Umgebungsvariablen

Siehe `.env.example` für alle Konfigurationsoptionen.
