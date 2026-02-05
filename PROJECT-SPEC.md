# Waldseilgarten CRM / Projektmanagement System
## Projekt-Spezifikation & Brainstorming

---

## 1. KERNSYSTEM

### 1.1 User Management & Authentifizierung
- Multi-Tenant fähig (mehrere Firmen/Mandanten)
- Rollen & Berechtigungen (Admin, Projektleiter, Mitarbeiter, Externe)
- SSO Integration (optional: Azure AD, Google Workspace)
- 2FA für sensible Accounts

### 1.2 Dashboard & Analytics
- **KPI-Übersicht:**
  - Offene Projekte nach Status
  - Umsatz/ROI pro Projekt
  - Kundenzufriedenheit (NPS)
  - Response-Time für Support-Tickets
  
- **Visualisierungen:**
  - Gantt-Charts für Projekt-Timelines
  - Kanban-Boards (wie Trello/Asana)
  - Heatmaps für E-Mail-Aufkommen
  - Umsatzverläufe (Charts.js/D3.js)

---

## 2. KUNDENVERWALTUNG (CRM)

### 2.1 Kundenstammdaten
- Firmendaten & Ansprechpartner
- Historie aller Interaktionen
- Dokumenten-Management (Verträge, Angebote)
- Tags & Kategorien für Segmentierung

### 2.2 Kommunikations-Tracking
- **IMAP-Integration:**
  - Gruppenpostfach einbinden
  - Automatischer E-Mail-Import
  - Attachment-Extraktion & Speicherung
  
- **Zuordnungs-Logik:**
  - Anhand Absender/Empfänger → Kunde
  - Betreff-Zeilen Keywords → Projekt
  - KI-gestützte Kategorisierung (später)

### 2.3 Verkaufsprozess (Pipeline)
- Lead-Status: Kontakt → Qualifiziert → Angebot → Gewonnen/Verloren
- Automatische Erinnerungen für Follow-ups
- Angebots- & Rechnungsgenerierung

---

## 3. PROJEKTVERWALTUNG

### 3.1 Projektdetails
- Projekt-Stammdaten (Name, Kunde, Zeitraum, Budget)
- Meilensteine & Checklisten
- Dateiablage pro Projekt
- Zeit-Tracking (optional mit Timer)

### 3.2 Aufgaben-Management
- Aufgaben mit Prioritäten, Fristen, Verantwortlichen
- Wiederkehrende Aufgaben (z.B. monatliche Reports)
- Abhängigkeiten zwischen Aufgaben
- Benachrichtigungen (E-Mail, In-App, Slack-Integration)

### 3.3 Team-Kollaboration
- Kommentare & Diskussionen pro Projekt
- @Mentions für Kollegen
- Aktivitäts-Log (wer hat wann was gemacht)

### 3.4 Dokumentenverwaltung (Projekt)
- **Dateiablage pro Projekt:**
  - Ordnerstruktur (beliebig verschachtelbar)
  - Datei-Upload (Drag & Drop)
  - Versionierung (mehrere Versionen pro Datei)
  - Vorschau für gängige Formate (PDF, Bilder, Office)
  - Download & Sharing (intern/extern)
- **Metadaten:**
  - Upload-Datum, Uploader
  - Dateigröße, Dateityp
  - Tags & Beschreibungen
  - Zugriffsrechte (wer darf sehen/bearbeiten)

---

## 4. DOKUMENTENVERWALTUNG (ALLGEMEIN)

### 4.1 Zentrale Dokumentenablage
- **Globaler Dokumentenspeicher** (unabhängig von Projekten)
- **Kategorien:**
  - Verträge & rechtliche Dokumente
  - Vorlagen (Angebote, Rechnungen, Briefe)
  - Marketing-Materialien
  - Schulungsunterlagen
  - Allgemeine Unternehmensdokumente
- **Ordnerstruktur:** Beliebig verschachtelbar mit Berechtigungen

### 4.2 Lokale Speicherung (Phase 1)
- **Speicherort:** `./data/uploads/documents/`
- **Struktur:**
  ```
  data/uploads/documents/
  ├── projects/
  │   ├── {project_id}/
  │   │   ├── files/
  │   │   └── versions/
  ├── general/
  │   ├── contracts/
  │   ├── templates/
  │   └── marketing/
  └── temp/
      └── (Upload-Cache)
  ```
- **Datei-Handling:**
  - UUID-basierte Speicherung (Sicherheit)
  - Original-Dateiname in DB gespeichert
  - MIME-Type Validierung
  - Virenscan (optional/clamav)
  - Größenlimit pro Datei (konfigurierbar)

### 4.3 SeaDrive Integration (Phase 2)
- **Mount-Point:** `/mnt/seadrive` oder Docker Volume
- **Sync-Modi:**
  - **Vollständig:** Alle Dateien lokal gecacht
  - **On-Demand:** Nur bei Zugriff herunterladen
  - **Selektiv:** Bestimmte Ordner synchronisieren
- **Integration:**
  - SeaDrive Client als separater Container
  - Auto-Sync bei Datei-Uploads
  - Konflikt-Handling (Versionen)
  - Offline-Zugriffsmöglichkeit

### 4.4 Dokumenten-Funktionen
- **Suche:**
  - Volltextsuche (später: OCR für PDFs/Bilder)
  - Filter nach Typ, Datum, Tags, Uploader
  - Schnellsuche über alle Projekte
- **Versionierung:**
  - Automatische Version bei Upload
  - Versionshistorie anzeigen
  - Wiederherstellung alter Versionen
  - Vergleichsfunktion (für Text-Dateien)
- **Sharing:**
  - Interne Links (für Team-Mitglieder)
  - Externe Links (zeitlich begrenzt, Passwort-geschützt)
  - Download-Tracking

### 4.5 API & Schnittstellen
- **Upload:** REST API mit Multipart-FormData
- **Download:** Direkte Links oder Streaming
- **WebDAV:** Optional für Desktop-Integration
- **Webhooks:** Bei neuen Uploads/Änderungen

---

## 5. E-MAIL-MANAGEMENT (IMAP)

### 4.1 Gruppenpostfach-Integration
- IMAP-Account pro Mandant konfigurierbar
- Automatischer Sync alle X Minuten
- SSL/TLS Verschlüsselung

### 4.2 Intelligente Zuordnung
| Regel | Beispiel |
|-------|----------|
| Absender-E-Mail | max@kunde.de → Projekt "Website Relaunch" |
| Betreff-Keyword | [Support] → Ticket-System |
| Domain-Mapping | @kunde.de → Kundennummer 12345 |
| Thread-Erkennung | Re: Angebot → Gleiches Projekt wie Original |

### 4.3 E-Mail-Vorlagen
- Templates für häufige Antworten
- Platzhalter: {{Kunde.Name}}, {{Projekt.Nummer}}
- Serien-E-Mails (z.B. Projekt-Updates an alle Stakeholder)

---

## 5. ERWEITERTE FEATURES (Nice-to-Have)

### 5.1 Automatisierung (Workflows)
WENN: Neue E-Mail von Kunde X
UND: Betreff enthält "Dringend"
DANN: 
  - Erstelle High-Priority Ticket
  - Benachrichtige Projektleiter per Slack
  - Füge zu Dashboard "Aktion erforderlich" hinzu

### 5.2 KI-Integration (später)
- **Sentiment-Analyse:** Erkennt frustrierte Kunden aus E-Mails
- **Zusammenfassung:** Lange E-Mail-Threads → TL;DR
- **Smart-Reply:** Vorgeschlagene Antworten basierend auf Kontext

### 5.3 Schnittstellen (API)
- REST API für Mobile Apps
- Webhooks für externe Systeme
- Import/Export (CSV, Excel, vCard)

### 5.4 Mobile-First
- Progressive Web App (PWA)
- Push-Benachrichtigungen
- Offline-Modus für unterwegs

---

## 6. TECH STACK VORSCHLÄGE

### Option A: Klassisch (PHP)
- **Backend:** Laravel oder Symfony
- **Frontend:** Vue.js oder Livewire
- **DB:** MariaDB/PostgreSQL
- **IMAP:** PHP IMAP Extension oder Symfony Mailer

### Option B: Modern (Node.js)
- **Backend:** NestJS oder Express
- **Frontend:** React oder Svelte
- **DB:** PostgreSQL mit Prisma ORM
- **IMAP:** Node-imap oder Nodemailer

### Option C: Python
- **Backend:** Django oder FastAPI
- **Frontend:** React/Vue
- **DB:** PostgreSQL
- **IMAP:** imaplib (Standard) oder imap-tools

### Option D: Go (Performance)
- **Backend:** Gin oder Echo
- **Frontend:** HTMX + Go Templates
- **DB:** PostgreSQL
- **IMAP:** emersion/go-imap

---

## 7. PROJEKTSTRUKTUR

```
~/projects/waldseilgarten-crm/
├── docker-compose.yml          # Podman-Compose Konfig
├── .env.example                # Umgebungsvariablen
├── backend/                    # API & Business Logic
│   ├── src/
│   │   ├── auth/              # Authentifizierung
│   │   ├── crm/               # Kundenverwaltung
│   │   ├── projects/          # Projektmanagement
│   │   ├── documents/         # Dokumentenverwaltung
│   │   │   ├── models.py      # DB-Modelle
│   │   │   ├── routes.py      # API-Endpunkte
│   │   │   ├── storage.py     # Speicher-Logik
│   │   │   └── seadrive.py    # SeaDrive Integration
│   │   ├── email/             # IMAP-Integration
│   │   └── ...
│   ├── migrations/
│   └── tests/
├── frontend/                   # Web-UI
│   ├── src/
│   ├── public/
│   └── package.json
├── worker/                     # Background Jobs (IMAP Sync)
│   └── src/
├── docs/                       # Dokumentation
│   ├── api/
│   ├── deployment.md
│   └── documents.md           # Dokumentenverwaltung Guide
└── data/                       # Volumes (DB, Uploads)
    ├── db/
    └── uploads/
        ├── documents/         # Lokale Dokumentenspeicherung
        │   ├── projects/      # Projekt-Dokumente
        │   ├── general/       # Allgemeine Dokumente
        │   └── temp/          # Upload-Cache
        └── seadrive/          # SeaDrive Mount (Phase 2)
```

---

## 8. DEPLOYMENT

### Traefik-Integration
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.waldseilgarten-crm.rule=Host(`crm.waldseilgarten-herrenberg.de`)"
  - "traefik.http.routers.waldseilgarten-crm.entrypoints=websecure"
  - "traefik.http.routers.waldseilgarten-crm.tls.certresolver=le"
```

### Services
- App-Server (Port 3000/8000/8080)
- PostgreSQL (Port 5432)
- Redis (für Caching & Sessions)
- IMAP-Worker (separater Container)
- **SeaDrive Client** (optional, Phase 2)
  - Container mit SeaDrive CLI
  - Mount: `./data/seadrive:/mnt/seadrive`
  - Auto-Sync zu Seafile Server

---

## 9. ERSTE SCHRITTE (MVP)

1. **User Auth** - Login, Rollen, Sessions
2. **Kunden-CRUD** - Basis-Verwaltung
3. **Projekte** - Anlegen, zuweisen, Status
4. **IMAP-Reader** - Mails abrufen & anzeigen
5. **Zuordnung** - Manuelle Verknüpfung Mail ↔ Projekt

---

## 10. DOKUMENTENVERWALTUNG - TECHNISCHE DETAILS

### 10.1 Datenbank-Schema (Dokumente)
```sql
-- Dokumente-Tabelle
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100),
    size_bytes BIGINT,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    category VARCHAR(50), -- 'project', 'contract', 'template', etc.
    folder_path VARCHAR(500) DEFAULT '/',
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    metadata JSONB -- Tags, Beschreibung, etc.
);

-- Versionen-Tabelle
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    size_bytes BIGINT,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    comment TEXT
);

-- Zugriffsrechte
CREATE TABLE document_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(20) -- 'read', 'write', 'delete'
);
```

### 10.2 Umgebungsvariablen (.env)
```bash
# Dokumenten-Speicherung
DOCUMENT_STORAGE_PATH=./data/uploads/documents
DOCUMENT_MAX_SIZE=100MB
DOCUMENT_ALLOWED_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,png,gif,zip

# SeaDrive (Phase 2)
SEADRIVE_ENABLED=false
SEADRIVE_SERVER_URL=https://seafile.example.com
SEADRIVE_USERNAME=crm@waldseilgarten.de
SEADRIVE_PASSWORD=secret
SEADRIVE_LIBRARY_ID=xxx-xxx-xxx
SEADRIVE_MOUNT_PATH=/mnt/seadrive
```

### 10.3 API-Endpunkte (Dokumente)
```
POST   /api/documents                    # Upload
GET    /api/documents                    # Liste (mit Filter)
GET    /api/documents/:id                # Details
GET    /api/documents/:id/download       # Download
PUT    /api/documents/:id                # Metadaten aktualisieren
DELETE /api/documents/:id                # Löschen

# Versionen
GET    /api/documents/:id/versions       # Versionshistorie
POST   /api/documents/:id/versions       # Neue Version hochladen
POST   /api/documents/:id/versions/:version_id/restore  # Wiederherstellen

# Projekt-Dokumente
GET    /api/projects/:id/documents       # Dokumente eines Projekts
POST   /api/projects/:id/documents       # Dokument zu Projekt hinzufügen
```

### 10.4 SeaDrive Integration (Phase 2)
```yaml
# docker-compose.yml Ergänzung
services:
  seadrive:
    image: seafile/seadrive:latest
    container_name: waldseilgarten-seadrive
    restart: unless-stopped
    environment:
      - SEAFILE_SERVER_URL=${SEADRIVE_SERVER_URL}
      - SEAFILE_USERNAME=${SEADRIVE_USERNAME}
      - SEAFILE_PASSWORD=${SEADRIVE_PASSWORD}
    volumes:
      - ./data/seadrive:/mnt/seadrive:shared
      - ./data/seadrive-cache:/root/.seadrive
    privileged: true  # Für FUSE mount
    networks:
      - waldseilgarten-network
```

---

## 11. OPEN-CODE HINweise

Für spätere Weiterentwicklung:
- Klare Code-Dokumentation (Docstrings)
- Datenbank-Schema in migrations/
- API-Endpunkte dokumentiert (Swagger/OpenAPI)
- .env.example mit allen Konfig-Optionen
- README mit Setup-Anleitung

---

## 12. ZUSÄTZLICHE IDEEN

### 11.1 Reporting
- PDF-Export für Projektberichte
- Zeiterfassung: Reports für Abrechnung
- Budget-Tracking mit Warnungen bei Überschreitung

### 11.2 Integrationen
- **Kalender:** Google Calendar / Outlook Sync
- **Dateien:** Nextcloud / Google Drive Integration
- **Kommunikation:** Slack / Teams Webhooks
- **Zahlung:** Stripe / PayPal für Rechnungen

---

## 13. GOOGLE CALENDAR INTEGRATION

### 13.1 Funktionsumfang
- **Zwei-Wege-Synchronisation:** CRM ↔ Google Calendar
- **Projekt-Termine:** Automatisch als Calendar-Events erstellen
- **Aufgaben-Fristen:** Als Erinnerungen im Kalender anzeigen
- **Team-Kalender:** Gemeinsamer Kalender für alle Projekte
- **Offline-Support:** Änderungen werden synchronisiert wenn online

### 13.2 Authentifizierung (OAuth 2.0)
```
1. User klickt "Mit Google verbinden"
2. OAuth-Flow öffnet sich
3. User gewährt Zugriff auf Calendar
4. Refresh Token wird gespeichert
5. API kann im Hintergrund syncen
```

### 13.3 Datenbank-Schema
```sql
CREATE TABLE google_calendar_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    google_email VARCHAR(255) NOT NULL,
    refresh_token TEXT NOT NULL,
    access_token TEXT,
    token_expires_at TIMESTAMP,
    calendar_id VARCHAR(255), -- 'primary' oder spezifische Calendar-ID
    sync_enabled BOOLEAN DEFAULT true,
    last_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    all_day BOOLEAN DEFAULT false,
    location VARCHAR(500),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    google_event_id VARCHAR(255), -- Google Calendar Event ID
    created_by UUID REFERENCES users(id),
    attendees JSONB, -- [{"email": "...", "name": "...", "response": "accepted"}]
    recurrence_rule TEXT, -- RRULE für wiederkehrende Events
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE calendar_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    direction VARCHAR(20), -- 'to_google', 'from_google'
    event_id UUID REFERENCES calendar_events(id),
    google_event_id VARCHAR(255),
    status VARCHAR(20), -- 'success', 'error', 'conflict'
    error_message TEXT,
    synced_at TIMESTAMP DEFAULT NOW()
);
```

### 13.4 API-Endpunkte
```
# OAuth
GET    /api/calendar/auth/google           # OAuth-URL generieren
POST   /api/calendar/auth/google/callback  # OAuth-Callback
DELETE /api/calendar/auth/google           # Verbindung trennen

# Calendar Events
GET    /api/calendar/events                # Alle Events (mit Filter)
POST   /api/calendar/events                # Event erstellen
GET    /api/calendar/events/:id            # Event Details
PUT    /api/calendar/events/:id            # Event aktualisieren
DELETE /api/calendar/events/:id            # Event löschen

# Sync
POST   /api/calendar/sync                  # Manueller Sync-Trigger
GET    /api/calendar/sync/status           # Sync-Status

# Projekt-Kalender
GET    /api/projects/:id/calendar/events   # Events eines Projekts
POST   /api/projects/:id/calendar/events   # Event zu Projekt hinzufügen
```

### 13.5 Synchronisations-Logik

#### CRM → Google Calendar
```typescript
// Wenn Event im CRM erstellt/aktualisiert wird
async syncToGoogle(event: CalendarEvent) {
  const googleEvent = {
    summary: event.title,
    description: event.description,
    start: { dateTime: event.start_time },
    end: { dateTime: event.end_time },
    location: event.location,
    attendees: event.attendees,
  };
  
  if (event.google_event_id) {
    // Update bestehendes Event
    await googleCalendar.events.update({
      calendarId: 'primary',
      eventId: event.google_event_id,
      resource: googleEvent
    });
  } else {
    // Neues Event erstellen
    const result = await googleCalendar.events.insert({
      calendarId: 'primary',
      resource: googleEvent
    });
    event.google_event_id = result.data.id;
    await event.save();
  }
}
```

#### Google Calendar → CRM
```typescript
// Regelmäßiger Sync (alle 15 Minuten)
async syncFromGoogle(userId: string) {
  const connection = await getGoogleConnection(userId);
  const lastSync = connection.last_sync_at;
  
  // Änderungen seit letztem Sync abrufen
  const changes = await googleCalendar.events.list({
    calendarId: 'primary',
    updatedMin: lastSync.toISOString(),
    showDeleted: true
  });
  
  for (const googleEvent of changes.data.items) {
    if (googleEvent.status === 'cancelled') {
      // Event wurde in Google gelöscht
      await deleteLocalEvent(googleEvent.id);
    } else {
      // Event erstellen oder aktualisieren
      await upsertLocalEvent(googleEvent);
    }
  }
  
  connection.last_sync_at = new Date();
  await connection.save();
}
```

### 13.6 Konflikt-Resolution
```typescript
// Wenn Event in beiden Systemen geändert wurde
async resolveConflict(localEvent, googleEvent) {
  const localUpdated = localEvent.updated_at;
  const googleUpdated = new Date(googleEvent.updated);
  
  if (localUpdated > googleUpdated) {
    // Lokale Änderung ist neuer → zu Google pushen
    await syncToGoogle(localEvent);
  } else {
    // Google-Änderung ist neuer → lokal aktualisieren
    await updateLocalEvent(localEvent, googleEvent);
  }
}
```

### 13.7 Umgebungsvariablen (.env)
```bash
# Google Calendar API
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3001/api/calendar/auth/google/callback
GOOGLE_CALENDAR_API_KEY=optional-api-key-for-public-calendars

# Sync-Einstellungen
CALENDAR_SYNC_INTERVAL_MINUTES=15
CALENDAR_SYNC_ENABLED=true
```

### 13.8 Frontend-Integration
- **Kalender-View:** FullCalendar oder react-big-calendar
- **OAuth-Button:** "Mit Google Calendar verbinden"
- **Event-Dialog:** Termine erstellen/bearbeiten mit Google-Sync-Option
- **Sync-Status:** Anzeige wann zuletzt synchronisiert wurde

### 13.9 Projekt-Struktur
```
backend/src/
├── calendar/
│   ├── calendar.module.ts
│   ├── calendar.controller.ts
│   ├── calendar.service.ts
│   ├── google-calendar.service.ts
│   ├── sync.service.ts
│   ├── entities/
│   │   ├── calendar-event.entity.ts
│   │   └── google-connection.entity.ts
│   └── dto/
│       ├── create-event.dto.ts
│       └── update-event.dto.ts
```

### 13.10 Pakete (package.json)
```json
{
  "dependencies": {
    "googleapis": "^144.0.0",
    "google-auth-library": "^9.15.0"
  }
}
```

### 11.3 Kundensicht (Portal)
- Kunden können Projekt-Status einsehen
- Dokumente hochladen/herunterladen
- Kommunikation im Ticketsystem

### 11.4 Sicherheit
- Audit-Log (wer hat wann auf welche Daten zugegriffen)
- Datenverschlüsselung (at rest & in transit)
- Backup-Automatisierung (täglich)
- GDPR-Konformität (Recht auf Vergessen)

---

**Status:** Brainstorming abgeschlossen  
**Erstellt:** 2026-02-05  
**Nächster Schritt:** Tech-Stack entscheiden & MVP planen
