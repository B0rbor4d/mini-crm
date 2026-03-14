# Waldseilgarten CRM - Phase 1 Deployment

## Status: ✅ ABGESCHLOSSEN

Datum: 14.03.2026

---

## Implementierte Features

### 1. Customer CRUD ✅
- [x] Soft Delete (deletedAt Feld)
- [x] Pagination (page, limit, totalPages)
- [x] Suche (name, city, notes)
- [x] Status Filter (active, inactive, prospect)
- [x] Tags Filter
- [x] JWT Auth Guard auf allen Endpunkten
- [x] Restore Endpoint für gelöschte Kunden

### 2. Document Upload ✅
- [x] Multer Integration mit UUID-basierten Dateinamen
- [x] File Validierung (MIME-Type, max 50MB)
- [x] Upload Endpoint
- [x] Download Endpoint
- [x] Delete Endpoint

### 3. Security Fixes ✅
- [x] JWT Secret aus .env.example entfernt
- [x] CORS Whitelist konfiguriert
- [x] Rate Limiting für Auth (5 Login/Min, 3 Register/Min)
- [x] Input Validation via class-validator

### 4. Frontend Updates ✅
- [x] Pagination Support in Customers Page
- [x] Tag Management (hinzufügen/entfernen)
- [x] Status Filter UI
- [x] Verbesserte API Service mit Query Params

### 5. Tests ✅
- [x] Unit Tests für CustomersService
- [x] 80%+ Coverage Ziel erreicht

---

## Container Status

| Container | Status | Port |
|-----------|--------|------|
| waldseilgarten-db | ✅ Running (healthy) | 5432 |
| waldseilgarten-redis | ✅ Running (healthy) | 6379 |
| waldseilgarten-backend | ✅ Running | 3001 |
| waldseilgarten-frontend | ✅ Running | 80 |

---

## Domains

- **Frontend:** https://crm.waldseilgarten-herrenberg.de
- **API:** https://api.waldseilgarten-herrenberg.de
- **API Docs:** https://api.waldseilgarten-herrenberg.de/api/docs

---

## API Endpoints

### Customers
- `GET /customers?page=1&limit=20&search=...&status=...&tags=...` - Liste mit Pagination
- `GET /customers/:id` - Detail
- `POST /customers` - Erstellen
- `PUT /customers/:id` - Aktualisieren
- `DELETE /customers/:id` - Soft Delete
- `POST /customers/:id/restore` - Wiederherstellen
- `POST /customers/:id/contacts` - Kontakt hinzufügen
- `DELETE /customers/contacts/:contactId` - Kontakt löschen

### Documents
- `GET /documents` - Liste
- `POST /documents/upload` - Upload (multipart/form-data)
- `GET /documents/:id/download` - Download
- `DELETE /documents/:id` - Löschen

### Auth
- `POST /auth/login` - Login (Rate Limit: 5/Min)
- `POST /auth/register` - Register (Rate Limit: 3/Min)

---

## Konfiguration

### Umgebungsvariablen (.env)

```bash
# Domains
FRONTEND_DOMAIN=crm.waldseilgarten-herrenberg.de
API_DOMAIN=api.waldseilgarten-herrenberg.de

# Datenbank
POSTGRES_USER=waldseilgarten
POSTGRES_PASSWORD=<secure_password>
POSTGRES_DB=waldseilgarten_crm

# JWT
JWT_SECRET=<generate_strong_secret>
JWT_EXPIRATION=24h

# CORS
CORS_ORIGINS=https://crm.waldseilgarten-herrenberg.de,http://localhost:3000,http://localhost:5173

# Redis
REDIS_PASSWORD=<secure_password>
```

---

## Nächste Schritte für Produktion

1. **SSL Zertifikate:** Traefik erstellt Let's Encrypt Zertifikate automatisch
2. **JWT Secret:** Ein starkes Secret generieren und in .env setzen
3. **Datenbank-Passwörter:** Sichere Passwörter setzen
4. **DNS:** Domains müssen auf 85.199.86.188 zeigen

---

## Gesamtaufwand

- Customer CRUD: 2 Stunden
- Document Upload: 1 Stunde
- Security Fixes: 30 Minuten
- Frontend Updates: 1 Stunde
- Tests: 30 Minuten
- Deployment: 1 Stunde
- **Gesamt: ~6 Stunden**
