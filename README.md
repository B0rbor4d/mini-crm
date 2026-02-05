# Mini CRM

A modern Customer Relationship Management system.

[![Deutsch](https://img.shields.io/badge/lang-de-blue.svg)](README.de.md)
[![English](https://img.shields.io/badge/lang-en-blue.svg)](README.md)

## 🚀 Features

### Core Features
- **🔐 User Management** - JWT-based authentication with roles (Admin, User)
- **👥 Customer Management** - Manage customers and contact persons
- **📋 Project Management** - Projects with status, budget, and timeframe
- **📎 Document Management** - Upload and download project documents
- **✅ Task Management** - Tasks with priorities and deadlines
- **📧 Email Management** - Assign and manage emails

### Additional Features
- **🎨 Dark Mode** - Support for light and dark themes
- **📱 Responsive Design** - Optimized for desktop and mobile
- **🔒 SSL/HTTPS** - Automatic SSL certificates via Let's Encrypt
- **🐳 Container Deployment** - Easy deployment with Podman/Docker

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 11
- **Database:** PostgreSQL 18
- **Cache:** Redis 7
- **ORM:** TypeORM
- **Authentication:** JWT
- **API Documentation:** Swagger/OpenAPI

### Frontend
- **Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **API Client:** TanStack Query (React Query)
- **Build Tool:** Vite

### Deployment
- **Container:** Podman
- **Reverse Proxy:** Traefik
- **SSL:** Let's Encrypt

## 📦 Installation

### Prerequisites
- Podman or Docker
- Docker Compose or Podman Compose

### Quick Start

1. **Clone the repository**
   ```bash
   git clone git@github.com:B0rbor4d/mini-crm.git
   cd mini-crm
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env
   ```

3. **Start containers**
   ```bash
   podman-compose up -d
   ```

4. **Access the application**
   - Frontend: https://your-domain.com
   - API: https://api.your-domain.com
   - API Documentation: https://api.your-domain.com/api/docs

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|----------|
| `POSTGRES_USER` | Database user | crm_user |
| `POSTGRES_PASSWORD` | Database password | changeme_secure_password |
| `POSTGRES_DB` | Database name | mini_crm |
| `JWT_SECRET` | JWT signing key | your-super-secret-jwt-key |
| `VITE_API_URL` | API URL for frontend | https://api.your-domain.com |

### Traefik Configuration

The application uses Traefik as a reverse proxy with automatic SSL encryption. Configuration is in `traefik/compose.yml`.

## 📝 API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get profile

### Customers
- `GET /customers` - List all customers
- `POST /customers` - Create new customer
- `GET /customers/:id` - Customer details
- `PUT /customers/:id` - Update customer
- `DELETE /customers/:id` - Delete customer

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `GET /projects/:id` - Project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Documents
- `GET /documents` - List all documents
- `POST /documents/upload` - Upload document
- `GET /documents/:id/download` - Download document
- `DELETE /documents/:id` - Delete document

## 🧪 Development

### Start Backend
```bash
cd backend
npm install
npm run start:dev
```

### Start Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please create a pull request or open an issue.

## 📞 Support

For questions or issues, please create a GitHub issue.

---

**Note:** This is an MVP (Minimum Viable Product). Additional features are planned in the [ROADMAP](ROADMAP.md).
