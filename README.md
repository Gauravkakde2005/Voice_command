# Voice Command Shopping Assistant

A full-stack shopping assistant that lets users add, update, search, favorite, and manage shopping items through a modern web dashboard or by voice. The app uses Google Gemini to parse spoken commands, stores data in MongoDB, and generates AI-powered recommendations from purchase history.

## Overview

This project is built as a monorepo with a React frontend and an Express backend. It is designed to feel like a practical assistant for everyday grocery and household shopping, with support for manual entry, voice input, category filtering, bulk delete, favorites, reminders, and recommendation panels.

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Sonner for toast notifications
- Lucide React for icons
- React Router DOM

### Backend

- Node.js
- Express
- TypeScript
- Mongoose
- Zod for validation
- dotenv for environment configuration
- morgan for logging
- helmet and cors for security and cross-origin support

### AI and Voice

- Google Gemini API for parsing voice commands
- Web Speech API for browser-based speech recognition

### Database and Deployment

- MongoDB Atlas
- Vercel for frontend deployment
- Render for backend deployment

## Features

- Add shopping items manually through the form
- Add items using voice commands
- Parse multilingual voice input into structured actions
- Favorite items and keep them at the top of the list
- Search items by product name, brand, category, and price range
- Bulk select and delete multiple items at once
- Store shopping reminders with a date and time
- Mark items as purchased
- Categorize items automatically when possible
- Fetch AI recommendations based on shopping history
- Show seasonal suggestions and substitutes
- Maintain a responsive UI for desktop and mobile

## Project Structure

```text
.
|-- client
|   `-- src
|       |-- app
|       |-- components
|       |-- hooks
|       |-- lib
|       |-- pages
|       |-- services
|       |-- styles
|       `-- types
|-- server
|   `-- src
|       |-- config
|       |-- constants
|       |-- controllers
|       |-- middleware
|       |-- models
|       |-- routes
|       |-- services
|       |-- types
|       `-- utils
|-- render.yaml
`-- package.json
```

## How It Works

### Frontend flow

The main dashboard lives in `client/src/pages/DashboardPage.tsx`. It combines the hero section, voice command panel, shopping list, filters, item form, and recommendation panel. The UI uses reusable components from `client/src/components` and keeps app state in custom hooks.

### Backend flow

The backend exposes REST APIs under `/api`. Controllers validate incoming data with Zod, delegate the business logic to services, and persist shopping items through Mongoose models. Voice commands are sent to Gemini, which returns structured JSON for the UI to act on.

### Data flow

1. A user adds or edits an item in the UI.
2. The frontend sends the request through the typed API client.
3. The server validates and stores the change in MongoDB.
4. The list refreshes and recommendations are updated.

## API Endpoints

### Health

- `GET /health`

### Shopping items

- `GET /api/items`
- `POST /api/items`
- `POST /api/items/bulk-delete`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`

### Voice commands

- `POST /api/voice/parse`

Request example:

```json
{
  "text": "Add 2 packets of milk"
}
```

Response example:

```json
{
  "success": true,
  "data": {
    "action": "add_item",
    "item": "milk",
    "quantity": 2,
    "category": "dairy",
    "language": "en"
  }
}
```

### Recommendations

- `GET /api/recommendations`

## Environment Variables

### Backend: `server/.env`

Copy `server/.env.example` to `server/.env` and set:

- `PORT`
- `NODE_ENV`
- `CLIENT_URL`
- `MONGODB_URI`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

Recommended Gemini model:

```bash
GEMINI_MODEL=gemini-2.5-flash
```

### Frontend: `client/.env`

Copy `client/.env.example` to `client/.env` and set:

- `VITE_API_BASE_URL`

## Local Development

1. Install dependencies from the repo root.

```bash
npm install
```

2. Create the environment files.

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

3. Start both apps.

```bash
npm run dev
```

4. Open the frontend in your browser.

```bash
http://localhost:5173
```

## Build and Run Scripts

### Root

- `npm run dev` starts client and server together
- `npm run build` builds server and client
- `npm run lint` checks TypeScript in both workspaces

### Client

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Server

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Deployment

### Frontend on Vercel

1. Import the `client` folder as a Vercel project.
2. Set `VITE_API_BASE_URL` to the deployed backend URL plus `/api`.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.

### Backend on Render

1. Create a new Web Service from this repository.
2. Set the root directory to `server`.
3. Use the included `render.yaml`.
4. Add `CLIENT_URL`, `MONGODB_URI`, and `GEMINI_API_KEY` in the Render environment settings.

## Notes

- MongoDB Atlas should allow your development IP or the correct network access rule.
- Gemini is used only for structured command parsing and recommendation generation.
- Reminder data is stored in the database and shown in the UI; browser notifications can be added later if needed.

## Future Improvements

- Add user authentication and per-user shopping lists
- Add browser or email notifications for reminders
- Add tests with Vitest and Supertest
- Add rate limiting and audit logging
- Add export to CSV or PDF
- Add offline-first sync support

## Author

Gaurav Kakde
Email - gauravkakde591@gmail.com
