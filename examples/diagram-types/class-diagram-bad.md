# Class Diagram - Bad Example

This example shows an overcrowded class diagram that triggers width and complexity warnings.

## Issue: Too Many Classes in One Diagram

**Problem:** This class diagram tries to show an entire system architecture with 15+ classes, making it overwhelming and too wide.

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
    class Product {
        +String name
        +Float price
        +String description
        +updateStock()
        +calculateDiscount()
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
    class Payment {
        +String paymentId
        +String method
        +Float amount
        +process()
        +refund()
    }
    class Cart {
        +String cartId
        +addItem()
        +removeItem()
        +checkout()
    }
    class Inventory {
        +checkStock()
        +updateQuantity()
        +reorder()
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
    class Notification {
        +String message
        +Date timestamp
        +send()
    }
    class Shipping {
        +String address
        +String carrier
        +Float cost
        +calculateCost()
        +track()
    }
    class Coupon {
        +String code
        +Float discount
        +Date expiry
        +validate()
        +apply()
    }
    class Logger {
        +log()
        +error()
        +debug()
    }
    class Database {
        +connect()
        +query()
        +disconnect()
    }

    User <|-- Admin
    User "1" --> "*" Order
    Order "1" --> "*" OrderItem
    Order "1" --> "1" Payment
    Order "1" --> "1" Shipping
    OrderItem "*" --> "1" Product
    Product "*" --> "1" Category
    Product "1" --> "*" Review
    User "1" --> "1" Cart
    Cart "1" --> "*" OrderItem
    Inventory --> Product
    User --> Notification
    Order --> Coupon
    Order --> Logger
    Product --> Logger
    Payment --> Logger
    Payment --> Database
    Order --> Database
    Product --> Database
```

**Mermaid-Sonar Output:**
- ❌ **ERROR:** Estimated width: ~2000px (exceeds 1500px error threshold)
- ❌ **15 classes** - too many to comprehend at once
- ❌ **27 relationships** - creates visual spaghetti
- ⚠️ High cognitive load - viewers can't identify key patterns
- Suggestion: Split into focused domain diagrams

## Why This Is a Problem

1. **Information overload** - too much to process at once
2. **Lost focus** - can't identify the main architectural patterns
3. **Hard to maintain** - changes require updating massive diagram
4. **Poor documentation** - can't explain specific subsystems clearly
5. **Width issues** - requires horizontal scrolling
6. **Relationship spaghetti** - arrows crossing everywhere

## See the Fix

Check [class-diagram-good.md](./class-diagram-good.md) for focused, domain-separated diagrams.
