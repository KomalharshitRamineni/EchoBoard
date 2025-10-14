# EchoBoard

Live site: https://echoboard-d6xs.onrender.com/

## Overview
EchoBoard is a full-stack note taking application built with the MERN stack. It provides a fast and focused writing experience, automatic persistence to MongoDB, and a production-ready deployment that serves the Vite frontend from the Express backend. Requests to the API are rate limited through Upstash Redis and every note is screened for profanity or hateful language before it is saved.

## Features
-  **Create, edit, and delete notes** with a clean, responsive UI built using React, Tailwind CSS, and daisyUI.
-  **Persistent storage** via MongoDB with timestamps to keep notes ordered by their last update.
-  **Content moderation** powered by `bad-words` and `leo-profanity` to prevent toxic submissions.
-  **Global rate limiting** using Upstash Redis to keep the public API resilient against bursts of traffic.
-  **Production-ready build**: the Express server statically serves the optimized Vite build when `NODE_ENV=production`.

## Tech stack
- **Frontend:** React, Vite, Tailwind CSS, daisyUI, React Router, Axios, react-hot-toast
- **Backend:** Node.js, Express, Mongoose, Upstash Redis
- **Database:** MongoDB Atlas or any MongoDB compatible instance

## Project structure
```
EchoBoard/
├── backend/                # Express API, MongoDB models, middleware
│   └── src/
│       ├── config/         # Database and Upstash configuration
│       ├── controllers/    # Route handlers for notes
│       ├── middleware/     # Rate limiting middleware
│       ├── models/         # Mongoose schemas
│       └── routes/         # Express routers
├── frontend/               # Vite + React single page application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Routed screens (home, create, detail)
│       └── lib/            # Axios client configuration
└── package.json            # Convenience scripts for builds and deploys
```

## Prerequisites
- Node.js 18+
- npm 9+
- A MongoDB connection string
- An Upstash Redis database (for rate limiting)

## Environment variables
Create a `.env` file inside the `backend` directory with the following variables:

```env
MONGO_URI=your-mongodb-connection-string
UPSTASH_REDIS_REST_URL=your-upstash-rest-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-rest-token
NODE_ENV=development
PORT=5001
```

> `Redis.fromEnv()` in the Upstash SDK reads the REST URL and token automatically. Keep these credentials private.

## Installation
1. Install the backend dependencies:
   ```bash
   npm install --prefix backend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install --prefix frontend
   ```

## Running locally
Start each service in its own terminal window:

```bash
# Terminal 1 - Express API
npm run dev --prefix backend

# Terminal 2 - React frontend (Vite)
npm run dev --prefix frontend
```

The frontend defaults to http://localhost:5173 and proxies API requests to http://localhost:5001/api during development.

## API reference
All routes are prefixed with `/api`.

| Method | Endpoint       | Description                    |
|--------|----------------|--------------------------------|
| GET    | `/notes`       | Fetch every note (newest first) |
| GET    | `/notes/:id`   | Fetch a single note by ID       |
| POST   | `/notes`       | Create a new note               |
| PUT    | `/notes/:id`   | Update an existing note         |
| DELETE | `/notes/:id`   | Delete a note                   |

Responses with status `422` indicate that banned words were detected, while `429` signifies the global rate limit was exceeded.

## Production build
To generate and serve the optimized frontend from the backend, run:

```bash
npm run build
npm start
```

`npm run build` installs dependencies in both apps and produces the Vite build inside `frontend/dist`. `npm start` launches the Express server on the configured `PORT`, serving the static assets and exposing the REST API.

## Deployment
The app is currently deployed on Render at https://echoboard-d6xs.onrender.com/. Deployments simply need the environment variables above configured in the hosting provider. The backend serves the static frontend bundle automatically when `NODE_ENV=production`.

## Troubleshooting
- **429 Too Many Requests:** Wait for the sliding window to reset (100 requests per 60 seconds globally).
- **422 Unprocessable Entity:** Remove profanity from the note title or content.
- **500 Internal Server Error:** Double-check your MongoDB URI and Redis credentials, then restart the backend server.

## License
This project is distributed under the ISC license. See the original repository for more details.
