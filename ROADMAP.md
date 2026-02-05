# Waldseilgarten CRM - Modulare Roadmap

## Übersicht: Modularer Aufbau

Das CRM wird in **5 Phasen** entwickelt. Jede Phase ist ein funktionierendes MVP, auf dem die nächste aufbaut.

---

## Phase 1: Foundation (MVP Core)
**Ziel:** Grundlegendes CRM mit Login, Kunden und Projekten

### Module:
1. **Auth-Modul** (`/backend/src/auth/`)
   - User Login/Logout
   - JWT-Sessions
   - Basis-Rollen (Admin, User)
   - Password-Reset

2. **Kunden-Modul** (`/backend/src/customers/`)
   - CRUD für Firmen
   - CRUD für Ansprechpartner
   - Suche & Filter

3. **Projekt-Modul** (`/backend/src/projects/`)
   - Projekt anlegen/bearbeiten
   - Status-Tracking (Neu → Aktiv → Abgeschlossen)
   - Projekt-Kunde Verknüpfung

4. **Dashboard-Modul** (`/backend/src/dashboard/`)
   - Einfache Statistiken (Anzahl Kunden/Projekte)
   - Letzte Aktivitäten

### Datenbank-Tabellen:
- `users`
- `customers`
- `contacts`
- `projects`

### Frontend:
- Login-Seite
- Dashboard
- Kunden-Liste & Detail
- Projekt-Liste & Detail

**Zeitschätzung:** 2-3 Wochen
**Deploy:** `crm.waldseilgarten-herrenberg.de`

---

## Phase 2: Dokumentenverwaltung
**Ziel:** Dateien zu Projekten und global hochladen/verwalten

### Neue Module:
5. **Dokumenten-Modul** (`/backend/src/documents/`)
   - Upload (lokal)
   - Download
   - Liste mit Filter
   - UUID-Speicherung

### Erweiterungen:
- Projekt-Modul: Dokumente anzeigen/hochladen
- Neue DB-Tabellen: `documents`, `document_versions`
- Storage: `./data/uploads/documents/`

### Frontend:
- Upload-Dialog (Drag & Drop)
- Dokumenten-Liste
- Download-Button

**Zeitschätzung:** 1 Woche
**Abhängigkeit:** Phase 1

---

## Phase 3: Aufgaben-Management
**Ziel:** Aufgaben zu Projekten erstellen und verfolgen

### Neue Module:
6. **Tasks-Modul** (`/backend/src/tasks/`)
   - Aufgaben CRUD
   - Prioritäten (Hoch/Mittel/Niedrig)
   - Fristen
   - Zuweisung an User
   - Status (Offen → In Arbeit → Erledigt)

### Erweiterungen:
- Projekt-Modul: Aufgaben-Liste pro Projekt
- Dashboard: Meine Aufgaben
- Neue DB-Tabelle: `tasks`

### Frontend:
- Aufgaben-Liste (Kanban-View optional)
- Aufgaben-Detail
- "Meine Aufgaben" Widget

**Zeitschätzung:** 1 Woche
**Abhängigkeit:** Phase 1

---

## Phase 4: E-Mail Integration
**Ziel:** IMAP-Postfach einbinden und Mails zuordnen

### Neue Module:
7. **IMAP-Worker** (`/worker/`)
   - IMAP-Connection
   - Mail-Sync alle X Minuten
   - Mail-Speicherung in DB

8. **Email-Modul** (`/backend/src/email/`)
   - Mail-Liste anzeigen
   - Mail-Detail (HTML/Text)
   - Manuelle Zuordnung zu Projekt/Kunde

### Erweiterungen:
- Neue DB-Tabellen: `emails`, `email_attachments`
- Projekt-Modul: Verknüpfte E-Mails anzeigen
- Kunden-Modul: E-Mail-Historie

### Frontend:
- E-Mail-Posteingang
- Mail-Detail-View
- Zuordnungs-Dialog

**Zeitschätzung:** 2 Wochen
**Abhängigkeit:** Phase 1

---

## Phase 5: Erweiterungen & Integrationen
**Ziel:** Erweiterte Features und Integrationen

### Module:
9. **Google Calendar Integration** (`/backend/src/calendar/`)
   - OAuth 2.0 Verbindung
   - Zwei-Wege-Synchronisation
   - Projekt-Termine syncen
   - Aufgaben-Fristen als Erinnerungen

10. **SeaDrive-Integration** (`/backend/src/documents/seadrive.py`)
    - SeaDrive Client Container
    - Sync zu Seafile
    - Konfigurierbar (an/aus)

11. **Erweitertes Auth**
    - 2FA
    - Passwort-Richtlinien
    - Session-Management

12. **Notifications**
    - E-Mail-Benachrichtigungen
    - In-App Notifications
    - WebSocket für Real-Time

13. **Reporting**
    - PDF-Export
    - Zeiterfassung
    - Umsatz-Reports

### Erweiterungen:
- Dokumenten-Versionierung
- Erweiterte Suche (Volltext)
- API für externe Systeme

**Zeitschätzung:** 4-5 Wochen
**Abhängigkeit:** Phase 2-4

---

## Implementierungs-Reihenfolge

```
Woche 1-3:   Phase 1 (Foundation)
Woche 4:     Phase 2 (Dokumente)
Woche 5:     Phase 3 (Aufgaben)
Woche 6-7:   Phase 4 (E-Mail)
Woche 8-11:  Phase 5 (Erweiterungen)
```

**Gesamt:** ~10-11 Wochen für v1.0

---

## Tech-Stack Empfehlung

Für modularen Aufbau empfehle ich:

### Option B: Node.js (NestJS)
**Warum:**
- Modularer Aufbau durch Decorators
- TypeScript = Type-Safety
- Große Community
- Gute ORM (Prisma/TypeORM)

**Struktur:**
```
backend/
├── src/
│   ├── auth/           # Phase 1
│   ├── customers/      # Phase 1
│   ├── projects/       # Phase 1
│   ├── documents/      # Phase 2
│   ├── tasks/          # Phase 3
│   ├── email/          # Phase 4
│   └── seadrive/       # Phase 5
├── migrations/
└── tests/
```

### Alternative: Python (FastAPI)
**Warum:**
- Sehr schnell zu entwickeln
- Moderne Python Features
- Automatische API-Doku
- Gute für IMAP (imap-tools)

---

## Nächster Schritt

1. **Tech-Stack entscheiden** (Node.js oder Python?)
2. **Phase 1 beginnen** mit:
   - Projekt-Setup (Docker, DB)
   - Auth-Modul
   - Erste API-Endpunkte

Soll ich mit Phase 1 beginnen? Welchen Tech-Stack bevorzugst du?
