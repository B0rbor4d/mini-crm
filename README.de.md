# Waldseilgarten CRM

Ein modernes Customer Relationship Management System für Waldseilgarten Herrenberg.

[![Deutsch](https://img.shields.io/badge/lang-de-blue.svg)](README.de.md)
[![English](https://img.shields.io/badge/lang-en-blue.svg)](README.md)

## 🚀 Funktionen

### Kernfunktionen
- **🔐 Benutzerverwaltung** - JWT-basierte Authentifizierung mit Rollen (Admin, User)
- **👥 Kundenmanagement** - Verwalten von Kunden und Ansprechpartnern
- **📋 Projektmanagement** - Projekte mit Status, Budget und Zeitraum
- **📎 Dokumentenverwaltung** - Upload und Download von Projekt-Dokumenten
- **✅ Aufgabenmanagement** - Aufgaben mit Prioritäten und Fristen
- **📧 E-Mail-Verwaltung** - E-Mails zuordnen und verwalten

### Zusätzliche Features
- **🎨 Dark Mode** - Unterstützung für helles und dunkles Theme
- **📱 Responsive Design** - Optimiert für Desktop und Mobile
- **🔒 SSL/HTTPS** - Automatische SSL-Zertifikate via Let's Encrypt
- **🐳 Container-Deployment** - Einfache Bereitstellung mit Podman/Docker

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 11
- **Datenbank:** PostgreSQL 18
- **Cache:** Redis 7
- **ORM:** TypeORM
- **Authentifizierung:** JWT
- **API-Dokumentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 19
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API-Client:** TanStack Query (React Query)
- **Build-Tool:** Vite

### Deployment
- **Container:** Podman
- **Reverse Proxy:** Traefik
- **SSL:** Let's Encrypt

## 📦 Installation

### Voraussetzungen
- Podman oder Docker
- Docker Compose oder Podman Compose

### Schnellstart

1. **Repository klonen**
   ```bash
   git clone git@github.com:B0rbor4d/mini-crm.git
   cd mini-crm
   ```

2. **Umgebungsvariablen konfigurieren**
   ```bash
   cp .env.example .env
   # .env anpassen
   ```

3. **Container starten**
   ```bash
   podman-compose up -d
   ```

4. **Auf die Anwendung zugreifen**
   - Frontend: https://crm.waldseilgarten-herrenberg.de
   - API: https://api.crm.waldseilgarten-herrenberg.de
   - API-Dokumentation: https://api.crm.waldseilgarten-herrenberg.de/api/docs

## 🔧 Konfiguration

### Umgebungsvariablen

| Variable | Beschreibung | Standard |
|----------|-------------|----------|
| `POSTGRES_USER` | Datenbank-Benutzer | waldseilgarten |
| `POSTGRES_PASSWORD` | Datenbank-Passwort | changeme_secure_password |
| `POSTGRES_DB` | Datenbank-Name | waldseilgarten_crm |
| `JWT_SECRET` | JWT-Signatur-Schlüssel | your-super-secret-jwt-key |
| `VITE_API_URL` | API-URL für Frontend | https://api.crm.waldseilgarten-herrenberg.de |

### Traefik-Konfiguration

Die Anwendung verwendet Traefik als Reverse Proxy mit automatischer SSL-Verschlüsselung. Die Konfiguration befindet sich in `traefik/compose.yml`.

## 📝 API-Endpunkte

### Authentifizierung
- `POST /auth/register` - Benutzer registrieren
- `POST /auth/login` - Benutzer anmelden
- `GET /auth/profile` - Profil abrufen

### Kunden
- `GET /customers` - Alle Kunden auflisten
- `POST /customers` - Neuen Kunden erstellen
- `GET /customers/:id` - Kunden-Details
- `PUT /customers/:id` - Kunden aktualisieren
- `DELETE /customers/:id` - Kunden löschen

### Projekte
- `GET /projects` - Alle Projekte auflisten
- `POST /projects` - Neues Projekt erstellen
- `GET /projects/:id` - Projekt-Details
- `PUT /projects/:id` - Projekt aktualisieren
- `DELETE /projects/:id` - Projekt löschen

### Dokumente
- `GET /documents` - Alle Dokumente auflisten
- `POST /documents/upload` - Dokument hochladen
- `GET /documents/:id/download` - Dokument herunterladen
- `DELETE /documents/:id` - Dokument löschen

## 🧪 Entwicklung

### Backend starten
```bash
cd backend
npm install
npm run start:dev
```

### Frontend starten
```bash
cd frontend
npm install
npm run dev
```

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🤝 Mitwirken

Beiträge sind willkommen! Bitte erstelle einen Pull Request oder öffne ein Issue.

## 📞 Support

Bei Fragen oder Problemen erstelle bitte ein GitHub Issue.

---

**Hinweis:** Dies ist ein MVP (Minimum Viable Product). Weitere Features sind in der [ROADMAP](ROADMAP.md) geplant.
