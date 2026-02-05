# Tech-Stack Empfehlung - Waldseilgarten CRM

## Executive Summary

**Empfohlener Stack: Node.js + NestJS + PostgreSQL + React**

Diese Kombination bietet die beste Balance aus:
- Modularem Aufbau für schrittweise Entwicklung
- Type-Safety durch TypeScript
- Große Community und Bibliotheken
- Einfache Wartung und Skalierung

---

## Warum NestJS?

### Vorteile für dieses Projekt:

**1. Modularität (Perfekt für MVP-Ansatz)**
```typescript
// Jedes Feature ist ein eigenes Modul
@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  controllers: [CustomersController],
  providers: [CustomersService],
})
export class CustomersModule {}

// In App-Modul einfach importieren
@Module({
  imports: [
    AuthModule,      // Phase 1
    CustomersModule, // Phase 1
    ProjectsModule,  // Phase 1
    DocumentsModule, // Phase 2
    TasksModule,     // Phase 3
    EmailModule,     // Phase 4
  ],
})
export class AppModule {}
```

**2. Dependency Injection**
- Saubere Architektur
- Einfaches Testing
- Lose Kopplung zwischen Modulen

**3. Eingebaute Features**
- Validation (class-validator)
- Authentication Guards
- Interceptors (Logging, Transform)
- Exception Filters
- Swagger/OpenAPI (automatisch)

**4. TypeScript = Type-Safety**
```typescript
// Keine Runtime-Fehler durch falsche Typen
interface CreateCustomerDto {
  name: string;
  email: string;
}

@Post()
async create(@Body() dto: CreateCustomerDto) {
  // dto ist garantiert valide
}
```

---

## Vollständiger Stack

### Backend

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Framework** | NestJS | Modularität, TypeScript, DI |
| **ORM** | TypeORM | Nativ für NestJS, Migrations, Relations |
| **Datenbank** | PostgreSQL | Robust, JSON-Support, Volltextsuche |
| **Cache** | Redis | Sessions, Caching, Rate-Limiting |
| **Auth** | Passport + JWT | Standard, gut dokumentiert |
| **Validation** | class-validator | Deklarativ, TypeScript |
| **IMAP** | imapflow | Moderne IMAP-Library, Promise-basiert |
| **File Upload** | multer | Standard für Express/NestJS |
| **API Docs** | Swagger (@nestjs/swagger) | Automatisch generiert |

### Frontend

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Framework** | React 18 | Flexibel, große Community |
| **Language** | TypeScript | Type-Safety |
| **State** | Zustand | Einfach, performant |
| **Query** | TanStack Query | Caching, Background-Updates |
| **Routing** | React Router v6 | Standard |
| **UI Library** | shadcn/ui | Moderne Komponenten, Tailwind |
| **Forms** | React Hook Form + Zod | Performance, Validation |
| **Charts** | Recharts | Einfach, React-Nativ |
| **Build** | Vite | Schnell, modern |

### DevOps

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| **Container** | Podman | Server-Standard |
| **Compose** | podman-compose | Einfache Orchestrierung |
| **Reverse Proxy** | Traefik | Bereits vorhanden |
| **SSL** | Let's Encrypt | Automatisch via Traefik |

---

## Alternative: Python (FastAPI)

### Wann Python wählen?

**Vorteile:**
- Schnellere Entwicklung (weniger Boilerplate)
- Hervorragend für IMAP (imap-tools)
- Automatische API-Dokumentation
- Weniger Code für gleiche Features

**Nachteile:**
- Weniger modular als NestJS
- Async/await komplexer
- Kleinere Ökosystem für Enterprise-Patterns

### Python Stack:
```
Backend: FastAPI + SQLAlchemy + PostgreSQL + Celery
Frontend: React (gleich wie oben)
```

---

## Warum NICHT andere Stacks?

### Laravel (PHP)
- ❌ Weniger modular für MVP-Ansatz
- ❌ TypeScript nicht nativ
- ❌ IMAP-Support schwächer

### Django (Python)
- ❌ Monolithisch, schwer modular
- ❌ Vue.js oder React müssen separat
- ❌ Für API-First überdimensioniert

### Go (Gin/Echo)
- ❌ Zu viel Boilerplate für CRUD
- ❌ Frontend-Integration komplexer
- ❌ Längere Entwicklungszeit

### Ruby on Rails
- ❌ Weniger populär (weniger Libraries)
- ❌ Performance-Probleme bei IMAP
- ❌ TypeScript-Integration schwierig

---

## Projektstruktur (NestJS)

```
~/projects/waldseilgarten-crm/
├── backend/
│   ├── src/
│   │   ├── auth/                    # Phase 1
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── register.dto.ts
│   │   │   └── entities/
│   │   │       └── user.entity.ts
│   │   │
│   │   ├── customers/               # Phase 1
│   │   │   ├── customers.controller.ts
│   │   │   ├── customers.service.ts
│   │   │   ├── customers.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       ├── customer.entity.ts
│   │   │       └── contact.entity.ts
│   │   │
│   │   ├── projects/                # Phase 1
│   │   │   ├── projects.controller.ts
│   │   │   ├── projects.service.ts
│   │   │   ├── projects.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       └── project.entity.ts
│   │   │
│   │   ├── documents/               # Phase 2
│   │   │   ├── documents.controller.ts
│   │   │   ├── documents.service.ts
│   │   │   ├── documents.module.ts
│   │   │   ├── storage/
│   │   │   │   ├── local.storage.ts
│   │   │   │   └── seadrive.storage.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       └── document.entity.ts
│   │   │
│   │   ├── tasks/                   # Phase 3
│   │   │   ├── tasks.controller.ts
│   │   │   ├── tasks.service.ts
│   │   │   ├── tasks.module.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       └── task.entity.ts
│   │   │
│   │   ├── email/                   # Phase 4
│   │   │   ├── email.controller.ts
│   │   │   ├── email.service.ts
│   │   │   ├── email.module.ts
│   │   │   ├── imap/
│   │   │   │   └── imap.service.ts
│   │   │   ├── dto/
│   │   │   └── entities/
│   │   │       └── email.entity.ts
│   │   │
│   │   ├── common/                  # Shared
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   │
│   │   ├── config/                  # Konfiguration
│   │   │   ├── database.config.ts
│   │   │   └── app.config.ts
│   │   │
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── test/
│   ├── migrations/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # shadcn/ui
│   │   │   ├── layout/
│   │   │   └── forms/
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── customers/
│   │   │   ├── projects/
│   │   │   ├── documents/
│   │   │   ├── tasks/
│   │   │   └── emails/
│   │   │
│   │   ├── hooks/
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── store/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.ts
│
├── worker/                          # IMAP Background Worker
│   ├── src/
│   │   ├── imap.worker.ts
│   │   └── email.processor.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Vorteile dieses Stacks

### 1. Type-Safety End-to-End
```typescript
// Backend DTO
export class CreateCustomerDto {
  @IsString()
  name: string;
  
  @IsEmail()
  email: string;
}

// Frontend (automatisch generiert oder geteilt)
interface CreateCustomerDto {
  name: string;
  email: string;
}
```

### 2. Automatische API-Dokumentation
```typescript
// Swagger UI automatisch verfügbar unter /api/docs
@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  @Post()
  @ApiOperation({ summary: 'Create customer' })
  @ApiResponse({ status: 201, type: Customer })
  create(@Body() dto: CreateCustomerDto) {}
}
```

### 3. Einfaches Testing
```typescript
// Unit Test
 describe('CustomersService', () => {
  let service: CustomersService;
  
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CustomersService],
    }).compile();
    
    service = module.get<CustomersService>(CustomersService);
  });
  
  it('should create customer', async () => {
    const result = await service.create({ name: 'Test', email: 'test@test.de' });
    expect(result.name).toBe('Test');
  });
});
```

### 4. Einfache Wartung
- Klare Struktur durch Module
- Dependency Injection
- Decorators für Cross-Cutting Concerns
- Migrations für Datenbank-Updates

---

## Zusammenfassung

| Aspekt | NestJS + React |
|--------|----------------|
| **Entwicklungszeit** | Mittel (gut dokumentiert) |
| **Lernkurve** | Moderat |
| **Modularität** | Exzellent |
| **Type-Safety** | Exzellent |
| **Community** | Groß |
| **IMAP-Support** | Gut (imapflow) |
| **Wartung** | Einfach |
| **Skalierung** | Gut |

**Fazit:** NestJS ist die beste Wahl für einen modularen, wartbaren Aufbau mit klaren Phasen.

---

## Nächster Schritt

Wenn du mit NestJS einverstanden bist:

1. **Projekt-Setup** (Docker, PostgreSQL, Redis)
2. **Phase 1 beginnen** mit Auth-Modul
3. **Erste API-Endpunkte** für Kunden

Soll ich mit dem Setup beginnen?
