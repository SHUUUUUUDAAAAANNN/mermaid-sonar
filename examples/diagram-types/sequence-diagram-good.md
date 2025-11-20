# Sequence Diagram - Good Example

This example shows the refactored sequence diagrams split into focused interaction scenarios.

## Solution: Split into Scenario-Focused Diagrams

Instead of one overwhelming diagram, we create focused diagrams for each interaction scenario.

### Scenario 1: User Registration Flow (Happy Path)

**Focus:** Core registration logic without infrastructure noise

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant AuthService
    participant Database

    User->>Browser: Fill registration form
    Browser->>AuthService: POST /register

    AuthService->>AuthService: Validate email & password
    AuthService->>Database: Check email uniqueness
    Database-->>AuthService: Email available

    AuthService->>Database: Create user record
    Database-->>AuthService: User created (id: 123)

    AuthService-->>Browser: 200 OK with auth token
    Browser->>User: Show welcome screen

    note over AuthService,Database: Validation details in separate diagram
```

**Improvements:**
- ✅ 4 participants - clear and focused
- ✅ 8 messages - easy to follow
- ✅ Shows only the critical path
- ✅ Fits standard viewport (640px width, ~480px height)
- ✅ Note references detailed validation flow

### Scenario 2: Input Validation Details

**Focus:** Validation logic and error handling

```mermaid
sequenceDiagram
    participant Browser
    participant AuthService
    participant ValidationService
    participant Database

    Browser->>AuthService: POST /register {email, password}

    AuthService->>ValidationService: Validate email format
    ValidationService-->>AuthService: Valid format

    AuthService->>ValidationService: Validate password strength
    alt Password too weak
        ValidationService-->>AuthService: Error: Password requirements not met
        AuthService-->>Browser: 400 Bad Request
    else Password valid
        ValidationService-->>AuthService: Password strength: strong
        AuthService->>Database: Check email uniqueness

        alt Email exists
            Database-->>AuthService: Email already registered
            AuthService-->>Browser: 409 Conflict
        else Email available
            Database-->>AuthService: Email unique
            AuthService-->>Browser: Validation passed
        end
    end

    note over ValidationService: Password rules:<br/>- Min 8 chars<br/>- 1 uppercase<br/>- 1 number
```

**Improvements:**
- ✅ 4 participants - manageable width
- ✅ Shows error scenarios with alt blocks
- ✅ Focused on validation logic only
- ✅ Note explains validation rules
- ✅ ~720px height - fits viewport

### Scenario 3: Post-Registration Notifications

**Focus:** Asynchronous notifications after successful registration

```mermaid
sequenceDiagram
    participant AuthService
    participant QueueService
    participant EmailService
    participant NotificationService

    Note over AuthService: User registration completed

    AuthService->>QueueService: Queue welcome email job
    AuthService->>QueueService: Queue push notification job
    AuthService-->>AuthService: Return success to user

    par Email Processing
        QueueService->>EmailService: Process welcome email
        EmailService->>EmailService: Generate email from template
        EmailService-->>QueueService: Email sent
    and Push Notification
        QueueService->>NotificationService: Process push notification
        NotificationService->>NotificationService: Send to device
        NotificationService-->>QueueService: Notification sent
    end

    note over QueueService: Async jobs processed<br/>independently of user request
```

**Improvements:**
- ✅ 4 participants - focused on notifications
- ✅ Shows async nature with par block
- ✅ Clear that user doesn't wait for these
- ✅ ~560px height - compact and clear

### Scenario 4: Infrastructure & Observability (Optional)

**Focus:** Cross-cutting concerns for operations team

```mermaid
sequenceDiagram
    participant Service as Any Service
    participant LoggingService
    participant MetricsService
    participant CacheService

    Note over Service: During any operation

    Service->>LoggingService: Log operation start
    Service->>MetricsService: Increment request counter

    Service->>Service: Execute business logic

    alt Operation successful
        Service->>CacheService: Update cache
        Service->>MetricsService: Record success metric
        Service->>LoggingService: Log success
    else Operation failed
        Service->>MetricsService: Record error metric
        Service->>LoggingService: Log error with stack trace
    end

    note over LoggingService,MetricsService: Applied to all service operations
```

**Improvements:**
- ✅ Shows pattern applicable to all services
- ✅ Separates infrastructure from business logic
- ✅ Relevant for operations/SRE team
- ✅ ~520px height - very focused

## System Context (Optional)

If you need a high-level overview of the services involved:

```mermaid
sequenceDiagram
    participant Client
    participant Frontend
    participant Backend
    participant Infrastructure

    Client->>Frontend: User action
    Frontend->>Backend: API request
    Backend->>Backend: Business logic
    Backend->>Infrastructure: Cross-cutting concerns
    Backend-->>Frontend: Response
    Frontend-->>Client: Update UI

    note over Frontend: Browser, Mobile App
    note over Backend: AuthService, ValidationService, etc.
    note over Infrastructure: Logging, Metrics, Cache, Queue

    note right of Client: Detailed flows:<br/>• User Registration (main flow)<br/>• Input Validation (validation)<br/>• Notifications (async jobs)<br/>• Infrastructure (observability)
```

**Benefits:**
- ✅ Shows system layers at high level
- ✅ Links to detailed scenario diagrams
- ✅ 4 participants - very simple
- ✅ Provides navigation to detailed flows

## Alternative: Group by System Layer

If the service count is the main issue, group by architectural layers:

### User-Facing Flow
```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant API Gateway as API<br/>Gateway
    participant Backend Services as Auth &<br/>Validation<br/>Services

    User->>Browser: Register
    Browser->>API Gateway: POST /register
    API Gateway->>Backend Services: Validate and create user
    Backend Services-->>API Gateway: User created
    API Gateway-->>Browser: Success + token
    Browser-->>User: Welcome!

    note over Backend Services: Details in backend diagram
```

### Backend Services Flow
```mermaid
sequenceDiagram
    participant Gateway as API Gateway
    participant Auth as Auth<br/>Service
    participant Validation as Validation<br/>Service
    participant Data as Database &<br/>Cache

    Gateway->>Auth: Create user request
    Auth->>Validation: Validate input
    Validation-->>Auth: Valid
    Auth->>Data: Store user
    Data-->>Auth: Stored
    Auth-->>Gateway: Success
```

## Key Takeaways

1. **One diagram = One scenario** - Focus on a specific use case
2. **4-6 participants maximum** for readability (640-960px width)
3. **10-15 messages maximum** for comprehension (~600-900px height)
4. **Separate concerns:**
   - Happy path vs error handling
   - Sync vs async operations
   - Business logic vs infrastructure
5. **Use notes** to reference related diagrams
6. **Show critical path first** - details in separate diagrams
7. **Group by abstraction level** - don't mix UI, business, and infrastructure

## Benefits of This Approach

- ✅ **Easier to understand** - each diagram tells one story
- ✅ **Easier to maintain** - update only the relevant scenario
- ✅ **Better documentation** - can explain each scenario independently
- ✅ **Fits in viewports** - no scrolling required
- ✅ **Printable** - each diagram fits on one page
- ✅ **Testable** - scenarios map directly to test cases
- ✅ **Reviewable** - can discuss specific interactions without noise

## Mapping to Tests

Each scenario diagram can map to a test suite:

- **Scenario 1** → `test_user_registration_happy_path()`
- **Scenario 2** → `test_registration_validation_errors()`
- **Scenario 3** → `test_post_registration_notifications()`
- **Scenario 4** → Integration tests for observability
