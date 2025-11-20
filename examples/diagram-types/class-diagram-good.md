# Class Diagram - Good Example

This example shows the refactored class diagrams split into focused domain areas.

## Solution: Split into Domain-Focused Diagrams

Instead of one overwhelming diagram, we create focused diagrams for each domain area.

### Domain 1: User Management

**Focus:** Authentication, authorization, and user profiles

```mermaid
classDiagram
    class User {
        +String username
        +String email
        +String password
        +login()
        +logout()
        +updateProfile()
    }
    class Admin {
        +String permissions
        +manageUsers()
        +viewLogs()
        +configureSystem()
    }
    class Notification {
        +String message
        +Date timestamp
        +send()
    }

    User <|-- Admin
    User --> Notification : receives
```

**Improvements:**
- ✅ 3 classes - easy to understand
- ✅ Clear inheritance relationship
- ✅ Focused on authentication domain

### Domain 2: Product Catalog

**Focus:** Products, categories, and reviews

```mermaid
classDiagram
    class Product {
        +String name
        +Float price
        +String description
        +updateStock()
        +calculateDiscount()
    }
    class Category {
        +String name
        +String description
        +listProducts()
    }
    class Review {
        +Int rating
        +String comment
        +Date reviewDate
        +moderate()
    }
    class Inventory {
        +checkStock()
        +updateQuantity()
        +reorder()
    }

    Product "*" --> "1" Category : belongs to
    Product "1" --> "*" Review : has
    Inventory --> Product : manages
```

**Improvements:**
- ✅ 4 classes - focused scope
- ✅ Clear product lifecycle
- ✅ Easy to understand inventory relationship

### Domain 3: Shopping & Orders

**Focus:** Cart, orders, and order items

```mermaid
classDiagram
    class Cart {
        +String cartId
        +addItem()
        +removeItem()
        +checkout()
    }
    class Order {
        +String orderId
        +Date orderDate
        +Float total
        +calculateTotal()
        +processPayment()
    }
    class OrderItem {
        +Int quantity
        +Float price
        +getSubtotal()
    }
    class Coupon {
        +String code
        +Float discount
        +Date expiry
        +validate()
        +apply()
    }

    Cart "1" --> "*" OrderItem : contains
    Order "1" --> "*" OrderItem : includes
    Order --> Coupon : uses

    note for Order "Cart converts to Order at checkout"
```

**Improvements:**
- ✅ 4 classes - clear shopping flow
- ✅ Shows cart-to-order transformation
- ✅ Coupon integration is obvious

### Domain 4: Payment & Fulfillment

**Focus:** Payment processing and shipping

```mermaid
classDiagram
    class Order {
        +String orderId
        +Float total
        +processPayment()
    }
    class Payment {
        +String paymentId
        +String method
        +Float amount
        +process()
        +refund()
    }
    class Shipping {
        +String address
        +String carrier
        +Float cost
        +calculateCost()
        +track()
    }

    Order "1" --> "1" Payment : processes
    Order "1" --> "1" Shipping : ships via

    note for Payment "Supports multiple payment methods"
    note for Shipping "Integrates with carrier APIs"
```

**Improvements:**
- ✅ 3 classes - clear payment flow
- ✅ Shows one-to-one relationships
- ✅ Notes provide integration context

### Domain 5: Infrastructure (Optional)

**Focus:** Cross-cutting concerns like logging and data access

```mermaid
classDiagram
    class Logger {
        +log(message)
        +error(error)
        +debug(info)
    }
    class Database {
        +connect()
        +query(sql)
        +disconnect()
    }

    class ServiceBase {
        <<abstract>>
        #Logger logger
        #Database db
        +logOperation()
        +executeQuery()
    }

    ServiceBase --> Logger : uses
    ServiceBase --> Database : accesses

    note for ServiceBase "Base class for all services\nProvides logging and data access"
```

**Improvements:**
- ✅ Shows infrastructure pattern
- ✅ Abstract base class clearly marked
- ✅ Explains cross-cutting concerns

## System Overview (Optional)

If you need a high-level overview, show **only** the main domain relationships:

```mermaid
classDiagram
    class UserDomain {
        <<domain>>
    }
    class ProductDomain {
        <<domain>>
    }
    class OrderDomain {
        <<domain>>
    }
    class PaymentDomain {
        <<domain>>
    }

    UserDomain --> OrderDomain : places orders
    OrderDomain --> ProductDomain : contains products
    OrderDomain --> PaymentDomain : processes payment

    note for UserDomain "See: user-management.md"
    note for ProductDomain "See: product-catalog.md"
    note for OrderDomain "See: shopping-orders.md"
    note for PaymentDomain "See: payment-fulfillment.md"
```

**Benefits of high-level overview:**
- ✅ Shows architecture at domain level
- ✅ Links to detailed domain diagrams
- ✅ Keeps cognitive load minimal

## Key Takeaways

1. **One diagram = One domain** - Keep diagrams focused on a single area
2. **5-8 classes maximum** per diagram for readability
3. **Use notes** to provide context and link to related diagrams
4. **Create a high-level overview** that links to detailed diagrams
5. **Each diagram should answer one question** - not show the entire system
6. **Organize by business domains** - not technical layers

## Benefits of This Approach

- ✅ **Easier to understand** - each diagram has clear purpose
- ✅ **Easier to maintain** - update only relevant diagram
- ✅ **Better documentation** - can explain each domain independently
- ✅ **Fits in viewports** - no horizontal scrolling
- ✅ **Printable** - each diagram fits on one page
- ✅ **Onboarding friendly** - new team members learn domain by domain
