# Daily Discussion - React Frontend

This is a React frontend for the Daily Discussion application.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev:client
```

Or run both the backend and frontend together:

```bash
npm run dev:all
```

3. Build for production:

```bash
npm run build
```

4. Preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/client/
├── main.jsx              # Entry point
├── App.jsx              # Main app component
├── index.html           # HTML template
├── index.css            # Global styles
├── components/
│   ├── DiscussionCard.jsx    # Discussion display component
│   ├── ResponsesList.jsx     # List of responses component
│   └── ReplyComposer.jsx     # Reply composer component
└── hooks/
    └── useApi.js        # Custom hooks for API calls
```

## Features

- Display daily discussion topic
- View and create responses
- Real-time updates with automatic refresh
- Responsive design with Bootstrap
- Beautiful glass-morphism UI
- Loading states and error handling

## API Integration

The app expects the following API endpoints:

- `GET /api/discussions/today` - Get today's discussion
- `GET /api/responses/discussion/:discussionId` - Get responses for a discussion
- `POST /api/responses` - Create a new response

Update the `API_BASE_URL` in `hooks/useApi.js` if your API runs on a different port.
