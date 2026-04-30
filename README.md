# Trinket Trove: An Ecommerce Analytics Dashboard

A fullstack TypeScript ecommerce mock store with an event driven analytics dashboard.

This project simulates a real product analytics pipeline from user actions (events) to aggregated insights and visual dashboards.

---

## Live Demo

[Vercel Link](https://trinket-trove-8d835iaff-rachels-projects-5d902f51.vercel.app)

---

## Features

### Ecommerce Flow
- Product listing and detail pages
- Cart system (session based, no auth required)
- Mock checkout flow
- Order creation and confirmation

### Analytics System
- Event tracking (product views, add to cart, checkout, purchases)
- KPI metrics:
  - Total revenue
  - Total orders
  - Average order value
  - Conversion rates
- Funnel analysis:
  - Product viewed → Add to cart → Checkout → Purchase
- Top products:
  - Most viewed
  - Most purchased
- Time-series analytics:
  - Revenue over time
  - Orders over time

### Dashboard
- Real-time metrics from database
- Interactive charts (Recharts)
- Date range filtering (7 days / 30 days)
- Recent activity feed (orders + events)

---

## Architecture Overview

This project follows a simplified analytics pipeline:

1. **User actions** trigger events  
2. Events are stored in a database  
3. Server-side functions aggregate metrics  
4. Dashboard visualizes the results

User → Event → Database → Aggregation → Dashboard

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Recharts (charts)

### Backend
- Node.js (via Next.js)
- Prisma ORM
- PostgreSQL

### Infrastructure
- Vercel (deployment)
- Prisma migrations

---

## Event Tracking

The app captures key user actions:

- `product_viewed`
- `add_to_cart`
- `cart_viewed`
- `checkout_started`
- `checkout_completed`
- `order_created`
- `order_item_purchased`

These events power all analytics and dashboard metrics.

---

## Example Metrics

- Revenue over time
- Orders per day
- Conversion rates
- Funnel drop-offs
- Product performance

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/trinket-trove.git
cd trinket-trove
```

2. Install dependencies

``` 
npm install
```

3. Set up environment variables
Create .env:

```
DATABASE_URL="your_postgres_connection_string"
```

4. Run migrations

```
npx prisma migrate dev
```

6. Seed database (optional)

```
npm run prisma:seed
```

8. Start dev server

```
npm run dev
```
