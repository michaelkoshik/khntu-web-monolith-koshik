# Вебплатформа бронювання заходів та продажу квитків (EventTicketing)

**Дисципліна:** Технологія розробки Інтернет-застосунків  
**Виконавець:** Кошик Михайло Сергійович, студент групи 2ПРс (спеціальність 121 / F2 «Інженерія програмного забезпечення»)  
**Варіант:** № 11  

---

## 1. Опис предметної області

Проєкт реалізує бекенд-моноліт вебзастосунку **EventTicketing** для онлайн-анонсування культурних, освітніх та розважальних заходів, керування майданчиками проведення подій і бронювання квитків користувачами.

### Основні сутності предметної області (5 сутностей):
1. **USER** — зареєстрований користувач платформи (відвідувач, організатор або адміністратор), який створює замовлення на квитки.
2. **VENUE** — фізичний або віртуальний майданчик (концертний зал, конференц-центр, лекторій), де проводяться заходи.
3. **EVENT** — конкретний захід із датою проведення, базовою ціною квитка та кількістю доступних місць, прив'язаний до певного майданчика (VENUE).
4. **BOOKING** — замовлення користувача (USER), яке фіксує загальну вартість, статус оплати та дату оформлення бронювання.
5. **BOOKING_TICKET** — проміжна сутність для реалізації зв'язку багато-до-багатьох (N:M) між замовленнями (BOOKING) та заходами (EVENT). Містить власні атрибути позиції замовлення: кількість квитків (quantity), зафіксовану ціну на момент покупки (priceAtPurchase) та категорію місця (seatZone).

---

## 2. ER-діаграма сутностей (Mermaid ERD)

```mermaid
erDiagram
    USER ||--o{ BOOKING : places
    VENUE ||--o{ EVENT : hosts
    BOOKING ||--|{ BOOKING_TICKET : contains
    EVENT ||--o{ BOOKING_TICKET : reserved_in

    USER {
        int id PK
        string email
        string fullName
        string role
        datetime createdAt
    }

    VENUE {
        int id PK
        string name
        string city
        string address
        int capacity
    }

    EVENT {
        int id PK
        int venueId FK
        string title
        datetime eventDate
        float basePrice
        int availableTickets
    }

    BOOKING {
        int id PK
        int userId FK
        float totalAmount
        string status
        datetime createdAt
    }

    BOOKING_TICKET {
        int id PK
        int bookingId FK
        int eventId FK
        int quantity
        float priceAtPurchase
        string seatZone
    }
```
