# Celestius Backend Task: Event Registration API

A small REST API for registering participants for the **Backend Development Workshop**. Registrations are stored in memory, with a maximum capacity of 50 participants.

## Tech Stack

- Node.js
- Express

## Getting Started

### Prerequisites

- Node.js 14.17 or newer (uses the built-in `crypto.randomUUID()`)

### Installation

```bash
npm install
```

### Run the server

```bash
npm start
```

The server runs on `http://localhost:3000` by default. Set the `PORT` environment variable to use a different port.

## API Endpoints

### 1. Register for the event

`POST /register`

**Request body (JSON)**

| Field     | Type   | Required | Notes                                  |
|-----------|--------|----------|----------------------------------------|
| `name`    | string | Yes      | Trimmed before saving                  |
| `email`   | string | Yes      | Trimmed, lowercased, must be valid     |
| `college` | string | No       | Defaults to `"Not Provided"`           |

**Example request**

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Asha Verma", "email": "asha@example.com", "college": "NIT Kurukshetra"}'
```

**Example response (201 Created)**

```json
{
  "message": "Successful registration",
  "data": {
    "id": "b3f1c2a4-5d6e-4f70-8a91-0c2d3e4f5a6b",
    "name": "Asha Verma",
    "email": "asha@example.com",
    "college": "NIT Kurukshetra",
    "registrationTime": "2026-10-26T16:00:00.000Z"
  },
  "seatsRemaining": 49
}
```

**Error responses**

| Status | Reason                                          |
|--------|-------------------------------------------------|
| 400    | Missing or invalid name/email, bad email format |
| 409    | Email already registered                        |
| 409    | Event is full (50 participants)                 |

### 2. View all registrations

`GET /registrations`

**Example response (200 OK)**

```json
{
  "event": "Backend Development Workshop",
  "capacity": 50,
  "totalRegistered": 1,
  "registrations": [ ... ]
}
```

### 3. View a single registration

`GET /registrations/:id`

Returns the registration with the given ID (200 OK), or `404` with `{ "error": "Registration not found" }` if it doesn't exist.

## Project Structure

```
.
├── server.js       # Express app and routes
├── package.json
└── README.md
```

## Notes

- Data is stored in memory, so all registrations are lost when the server restarts.
- Duplicate detection is case-insensitive on email (`A@x.com` and `a@x.com` are the same person).
- `server.js` exports the Express `app`, so it can be imported in tests (for example with supertest) without starting the server.
