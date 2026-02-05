# Tech-Stack Übersicht - Aktuelle Versionen (Februar 2026)

## Zusammenfassung

| Komponente | Version | Status | Kompatibel |
|------------|---------|--------|------------|
| **Node.js** | 24.x LTS | Active LTS | ✅ |
| **NestJS** | 11.x | Stable | ✅ |
| **React** | 19.x | Stable | ✅ |
| **TypeScript** | 5.9.x | Stable | ✅ |
| **PostgreSQL** | 18.x | Stable | ✅ |
| **TypeORM** | 0.3.x | Stable | ✅ |
| **Redis** | 7.x | Stable | ✅ |
| **Vite** | 7.x | Stable | ✅ |

**Alle Komponenten sind miteinander kompatibel!**

---

## Detaillierte Versionen

### Backend

| Paket | Version | Begründung |
|-------|---------|------------|
| **Node.js** | 24.13.0 (LTS) | Aktive LTS bis Okt 2026 |
| **@nestjs/core** | 11.1.13 | Aktuellste Major |
| **@nestjs/common** | 11.1.13 | Gleiche Version wie core |
| **@nestjs/platform-express** | 11.1.13 | HTTP-Adapter |
| **@nestjs/typeorm** | 11.x | Offizielles TypeORM-Modul |
| **@nestjs/config** | 4.x | Umgebungsvariablen |
| **@nestjs/swagger** | 11.x | API-Dokumentation |
| **@nestjs/passport** | 11.x | Auth-Integration |
| **@nestjs/jwt** | 11.x | JWT-Handling |
| **typeorm** | 0.3.28 | Aktuellste Version |
| **pg** | 8.13.x | PostgreSQL-Client |
| **passport** | 0.7.x | Auth-Middleware |
| **passport-jwt** | 4.x | JWT-Strategie |
| **passport-local** | 1.x | Local-Strategie |
| **bcrypt** | 5.1.x | Passwort-Hashing |
| **class-validator** | 0.14.x | DTO-Validierung |
| **class-transformer** | 0.5.x | Objekt-Mapping |
| **imapflow** | 1.0.x | Moderne IMAP-Library |
| **multer** | 1.4.x | File-Upload |
| **uuid** | 11.x | UUID-Generierung |
| **redis** | 5.10.0 | Redis-Client |
| **@types/node** | 22.x | TypeScript-Types |
| **typescript** | 5.9.3 | Aktuellste Version |
| **ts-node** | 10.9.2 | TypeScript-Execution |
| **jest** | 29.x | Testing |
| **@nestjs/testing** | 11.x | NestJS-Testing |

### Frontend

| Paket | Version | Begründung |
|-------|---------|------------|
| **react** | 19.2.4 | Aktuellste Major |
| **react-dom** | 19.2.4 | Gleiche Version |
| **@types/react** | 19.x | TypeScript-Types |
| **@types/react-dom** | 19.x | TypeScript-Types |
| **react-router-dom** | 7.x | Routing |
| **@tanstack/react-query** | 5.91.x | Data-Fetching |
| **axios** | 1.13.4 | HTTP-Client |
| **zustand** | 5.x | State-Management |
| **zod** | 3.24.x | Schema-Validierung |
| **react-hook-form** | 7.54.x | Form-Management |
| **@hookform/resolvers** | 3.x | Zod-Integration |
| **lucide-react** | 0.474.x | Icons |
| **clsx** | 2.1.x | Klassen-Utility |
| **tailwind-merge** | 3.x | Tailwind-Utility |
| **date-fns** | 4.x | Datums-Handling |
| **recharts** | 2.15.x | Charts |

### Build-Tools

| Paket | Version | Begründung |
|-------|---------|------------|
| **vite** | 7.3.1 | Build-Tool |
| **@vitejs/plugin-react** | 4.3.x | React-Plugin |
| **typescript** | 5.9.3 | TypeScript |
| **eslint** | 9.x | Linter |
| **@typescript-eslint** | 8.x | TypeScript-ESLint |
| **prettier** | 3.5.x | Formatter |

### DevOps

| Komponente | Version | Begründung |
|------------|---------|------------|
| **PostgreSQL** | 18.1 | Aktuellste Major |
| **Redis** | 7.4.x | Cache & Sessions |
| **Traefik** | 3.3.x | Reverse Proxy |
| **Podman** | 5.x | Container |
| **podman-compose** | 1.x | Compose |

---

## Kompatibilitäts-Matrix

### NestJS 11.x Kompatibilität

| Dependency | Min Version | Max Version | Status |
|------------|-------------|-------------|--------|
| Node.js | 20.x | 24.x | ✅ 24.x LTS |
| TypeScript | 5.0 | 5.9.x | ✅ 5.9.3 |
| TypeORM | 0.3.0 | 0.3.x | ✅ 0.3.28 |
| Express | 4.x | 5.x | ✅ 4.21.x |
| Fastify | 5.x | 5.x | Optional |

### React 19.x Kompatibilität

| Dependency | Min Version | Max Version | Status |
|------------|-------------|-------------|--------|
| Node.js | 18.x | 24.x | ✅ 24.x |
| TypeScript | 5.0 | 5.9.x | ✅ 5.9.3 |
| React Router | 7.x | 7.x | ✅ 7.x |
| TanStack Query | 5.x | 5.x | ✅ 5.91.x |

### TypeORM 0.3.x Kompatibilität

| Dependency | Min Version | Max Version | Status |
|------------|-------------|-------------|--------|
| Node.js | 16.x | 24.x | ✅ 24.x |
| TypeScript | 4.5 | 5.9.x | ✅ 5.9.3 |
| PostgreSQL | 12.x | 18.x | ✅ 18.x |
| pg (driver) | 8.x | 8.x | ✅ 8.13.x |

---

## Versions-Pinning Strategie

### package.json (Backend)

```json
{
  "dependencies": {
    "@nestjs/common": "^11.1.0",
    "@nestjs/core": "^11.1.0",
    "@nestjs/platform-express": "^11.1.0",
    "@nestjs/typeorm": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/swagger": "^11.0.0",
    "@nestjs/passport": "^11.0.0",
    "@nestjs/jwt": "^11.0.0",
    "typeorm": "^0.3.28",
    "pg": "^8.13.0",
    "passport": "^0.7.0",
    "passport-jwt": "^4.0.0",
    "passport-local": "^1.0.0",
    "bcrypt": "^5.1.0",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "imapflow": "^1.0.0",
    "multer": "^1.4.5",
    "uuid": "^11.0.0",
    "redis": "^5.10.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^11.1.0",
    "@types/node": "^22.0.0",
    "@types/bcrypt": "^5.0.0",
    "@types/multer": "^1.4.0",
    "@types/uuid": "^10.0.0",
    "@types/passport-jwt": "^4.0.0",
    "@types/passport-local": "^1.0.0",
    "typescript": "^5.9.0",
    "ts-node": "^10.9.0",
    "jest": "^29.0.0",
    "@types/jest": "^29.0.0",
    "ts-jest": "^29.0.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

### package.json (Frontend)

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.0.0",
    "@tanstack/react-query": "^5.91.0",
    "axios": "^1.13.0",
    "zustand": "^5.0.0",
    "zod": "^3.24.0",
    "react-hook-form": "^7.54.0",
    "@hookform/resolvers": "^3.0.0",
    "lucide-react": "^0.474.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^3.0.0",
    "date-fns": "^4.0.0",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^7.3.0",
    "typescript": "^5.9.0",
    "eslint": "^9.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "prettier": "^3.5.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "autoprefixer": "^10.4.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "npm": ">=10.0.0"
  }
}
```

---

## Docker-Compose Versionen

```yaml
services:
  postgres:
    image: postgres:18.1-alpine
    # PostgreSQL 18.1 - Aktuellste Version
    
  redis:
    image: redis:7.4-alpine
    # Redis 7.4 - Stable
    
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 24-alpine
    # Node.js 24 LTS
    
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      args:
        NODE_VERSION: 24-alpine
    # Node.js 24 LTS
```

---

## Update-Strategie

### Automatische Updates (Patch)
- `^11.1.0` → akzeptiert 11.1.1, 11.1.2, etc.
- Keine Breaking Changes
- Security Fixes automatisch

### Manuelle Updates (Minor/Major)
- Minor: Nach 2-4 Wochen Testzeit
- Major: Nach gründlicher Prüfung
- Immer in separatem Branch testen

### Update-Check
```bash
# Alle veralteten Pakete anzeigen
npm outdated

# Interaktives Update
npm update

# Major Updates prüfen
npx npm-check-updates
```

---

## Bekannte Einschränkungen

### React 19
- ⚠️ React Server Components haben kürzlich Security Fixes erhalten (v19.0.1, v19.1.2, v19.2.1)
- ✅ Wir verwenden Client-Side React (keine Server Components)
- ✅ Keine zusätzlichen Maßnahmen nötig

### NestJS 11
- ✅ Keine bekannten Einschränkungen
- ✅ Vollständig kompatibel mit Node.js 24

### TypeORM 0.3.x
- ✅ Stabil und produktionsreif
- ⚠️ Einige Breaking Changes von 0.2.x (Migration nötig bei Upgrade)

---

## Fazit

✅ **Alle Komponenten sind kompatibel**
✅ **Aktuellste Major-Versionen**
✅ **LTS-Versionen wo möglich**
✅ **Sicherheitsupdates automatisch**

Der Stack ist bereit für die Entwicklung!
