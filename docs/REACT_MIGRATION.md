# React Migration Guide

## What's Changed

Your application has been converted from a static HTML/vanilla JavaScript app to a modern React application with the following improvements:

### Structure

- **Before**: Single `index.html` with inline styles
- **After**: Component-based React app with Vite bundler

### Key Improvements

1. **Component-Based Architecture**

   - `DiscussionCard` - Displays the daily discussion topic
   - `ResponsesList` - Shows all responses with real-time updates
   - `ReplyComposer` - Interactive reply form with auto-sizing textarea
   - `App` - Main container component

2. **Custom Hooks for API Calls**

   - `useDiscussion()` - Fetch today's discussion
   - `useResponses()` - Fetch responses for a discussion
   - `usePostResponse()` - Submit new responses
   - All hooks include loading states and error handling

3. **Modern Tooling**

   - Vite for fast development and optimized builds
   - React 18 with strict mode
   - Bootstrap 5.3.8 for styling
   - Axios for HTTP requests

4. **State Management**
   - Uses React hooks (useState, useEffect)
   - Local component state for forms
   - No external state management library needed

### File Structure

```
src/client/
├── main.jsx                 # React entry point
├── index.html              # Single HTML root (Vite processes this)
├── index.css               # All original styles preserved
├── App.jsx                 # Main app component
├── App.css                 # App-specific styles
├── components/
│   ├── DiscussionCard.jsx      # Discussion display
│   ├── ResponsesList.jsx       # Responses list with items
│   └── ReplyComposer.jsx       # Reply form component
├── hooks/
│   └── useApi.js           # API integration hooks
└── README.md               # Client-side documentation
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- Running backend server on port 8080

### Installation

1. Install dependencies:

```bash
npm install
```

2. Copy and configure environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your configuration:

```
VITE_API_URL=http://localhost:8080/api
```

### Development

Run the frontend development server:

```bash
npm run dev:client
```

The app will be available at `http://localhost:5173`

The Vite dev server automatically proxies `/api` requests to your backend.

### Run Backend and Frontend Together

```bash
npm run dev:all
```

This requires `concurrently` package. To install it:

```bash
npm install --save-dev concurrently
```

### Production Build

Build optimized production files:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## API Endpoints Expected

The React app expects the following API endpoints from your Express backend:

```
GET  /api/discussions/today              # Get today's discussion
GET  /api/responses/discussion/:id        # Get responses for a discussion
POST /api/responses                       # Create a new response
```

### Response Format Examples

**Discussion:**

```json
{
  "id": 1,
  "title": "Discussion Title",
  "content": "Discussion content here...",
  "createdAt": "2024-01-09T10:00:00Z"
}
```

**Response:**

```json
{
  "id": 1,
  "discussionId": 1,
  "author": "User Name",
  "content": "Response content here...",
  "createdAt": "2024-01-09T10:15:00Z"
}
```

## Key Component Props and Usage

### DiscussionCard

```jsx
<DiscussionCard
  discussion={discussionObject}
  loading={isLoading}
  onReload={refetchFunction}
>
  {/* Child component - typically ReplyComposer */}
</DiscussionCard>
```

### ResponsesList

```jsx
<ResponsesList
  responses={responsesArray}
  loading={isLoading}
  onReload={refetchFunction}
/>
```

### ReplyComposer

```jsx
<ReplyComposer discussionId={topicId} onReplyPosted={callbackFunction} />
```

## Features Implemented

✅ Display daily discussion topic
✅ Show all responses with timestamps
✅ Create new responses with form validation
✅ Auto-sizing textarea for replies
✅ Real-time response count
✅ Loading states with skeletons
✅ Error handling and display
✅ Toast notifications
✅ Responsive design (mobile to desktop)
✅ Glass-morphism UI effects
✅ Smooth animations

## Migration Notes

1. **All Styles Preserved**: The beautiful glass-morphism design, animations, and responsive layout are fully preserved in `src/client/index.css`

2. **Bootstrap Integration**: Bootstrap is now properly imported via npm package instead of CDN, ensuring consistency.

3. **No Breaking Changes**: The backend API remains unchanged. Only the frontend has been refactored.

4. **Auto-Proxy**: The Vite dev server automatically proxies API calls to your backend on port 8080.

5. **Component Reusability**: Each component is now reusable and testable independently.

## Customization

### Changing API Base URL

Edit `src/client/hooks/useApi.js`:

```javascript
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";
```

### Adding New Features

1. Create new components in `src/client/components/`
2. Create custom hooks in `src/client/hooks/` if needed
3. Import and use in `App.jsx`

### Styling

- Global styles: `src/client/index.css`
- Component-specific: Create `.css` file next to component or use inline styles

## Troubleshooting

**CORS Issues?**

- Ensure your Express backend has proper CORS configuration
- The Vite dev server proxies `/api` requests automatically

**API Calls Failing?**

- Check that backend is running on port 8080
- Update `API_BASE_URL` in `useApi.js` if needed
- Check browser console for detailed errors

**Build Issues?**

- Delete `node_modules` and `dist` folder
- Run `npm install` again
- Try `npm run build` with verbose output

## Next Steps

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev:client`
3. Test the app at `http://localhost:5173`
4. Build for production: `npm run build`

The React migration is complete and ready to use! 🎉
