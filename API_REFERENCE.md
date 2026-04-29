# DukanDost Pro — API Reference (v1.0)

Welcome to the DukanDost Pro API documentation. This API follows RESTful principles and returns JSON-encoded responses.

## Authentication
All API requests must be authenticated using a JWT Bearer token.
Header: `Authorization: Bearer <your_token>`

## Base URL
`http://localhost:5000/api` (Local)
`https://api.dukandost.pro/v1` (Production)

---

## 1. Authentication (`/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new owner/business. |
| POST | `/auth/login` | Login and receive a JWT. |
| GET | `/auth/profile` | Get current user details. |

## 2. Customers (`/customers`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | List all active customers. |
| POST | `/customers` | Create a new customer. |
| GET | `/customers/:id` | Get customer details and ledger summary. |
| DELETE | `/customers/:id` | Deactivate/Delete a customer. |

## 3. Billing & Invoices (`/invoices`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/invoices` | List invoices (supports pagination). |
| POST | `/invoices` | Create a new invoice and update customer balance. |
| GET | `/invoices/:id` | Get full invoice details. |
| POST | `/invoices/:id/payment` | Record a payment against an invoice. |

## 4. AI & Analytics (`/ai-insights`, `/analytics`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ai-insights/health-score` | Get business health index and recommendations. |
| GET | `/analytics/dashboard` | Get aggregated stats (Sales, Recovery, Expenses). |
| GET | `/analytics/p-and-l` | Fetch P&L statement data. |

## 5. Marketing (`/campaigns`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/campaigns` | List all promotional broadcasts. |
| POST | `/campaigns` | Create a new campaign (Business Plan only). |
| POST | `/campaigns/:id/send` | Execute the bulk broadcast. |

---

## Response Formats
### Success
```json
{
  "success": true,
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error description here"
}
```

## Rate Limiting
Maximum 100 requests per 15 minutes per IP address.
