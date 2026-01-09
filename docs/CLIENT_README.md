# React Conversion - User & Admin Clients

Your Daily Discussion application has been fully converted to React with separate clients for users and admins.

## ✅ Working Servers

- **User Client**: http://localhost:5173
- **Admin Client**: http://localhost:5174
- **Backend API**: http://localhost:8080

## 📁 Project Structure

```
src/
├── client/                    # User-facing client
│   ├── main.jsx              # React entry point
│   ├── App.jsx               # Main app component
│   ├── index.html            # HTML template
│   ├── index.css             # Global styles
│   ├── components/
│   │   ├── DiscussionCard.jsx     # Discussion display
│   │   ├── ResponsesList.jsx      # Responses list
│   │   └── ReplyComposer.jsx      # Reply form
│   ├── hooks/
│   │   └── useApi.js         # API hooks
│   └── README.md             # Client documentation
│
└── admin/                    # Admin dashboard
    ├── main.jsx              # React entry point
    ├── AdminApp.jsx          # Main admin app
    ├── index.html            # HTML template
    ├── admin.css             # Admin styles
    ├── components/
    │   ├── UsersTab.jsx          # Users management
    │   ├── DiscussionsTab.jsx    # Discussions management
    │   └── ResponsesTab.jsx      # Responses management
    ├── hooks/
    │   └── useAdminApi.js    # Admin API hooks
    └── README.md             # Admin documentation
```

## 🚀 Getting Started

### Install Dependencies

```bash
npm install
```

### Run Both Clients (with backend)

```bash
npm run dev:all
```

This runs:

- Backend server on port 8080
- User client on port 5173
- Admin client on port 5174

### Run Individually

**User Client Only:**

```bash
npm run dev:client
```

**Admin Client Only:**

```bash
npm run dev:admin
```

**Backend Only:**

```bash
npm run dev
```

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start backend only
npm run dev:client      # Start user client on port 5173
npm run dev:admin       # Start admin client on port 5174
npm run dev:all         # Start all three (requires concurrently)

# Production Build
npm run build           # Build both clients
npm run build:client    # Build user client
npm run build:admin     # Build admin client

# Preview
npm run preview:client  # Preview user build
npm run preview:admin   # Preview admin build
```

## 🎯 User Client Features

**Location**: http://localhost:5173

- ✅ View today's discussion topic
- ✅ See all responses/replies
- ✅ Create new responses
- ✅ Real-time updates
- ✅ Auto-sizing reply textarea
- ✅ Loading states with skeleton screens
- ✅ Error handling and notifications
- ✅ Beautiful glass-morphism UI
- ✅ Responsive mobile design

## 🔐 Admin Dashboard Features

**Location**: http://localhost:5174

### Users Tab

- View all users
- Search users by name or email
- See user roles and activity status
- Manage user accounts

### Discussions Tab

- View all discussions
- Create new discussions
- Edit existing discussions
- Schedule discussions by date
- Manage discussion content

### Responses Tab

- View responses for each discussion
- Filter by discussion
- Search responses
- See response timestamps
- View response authors

## 🔌 API Integration

### API Endpoints Expected

```
GET  /api/users                            # Get all users
GET  /api/discussions                      # Get all discussions
GET  /api/discussions/today               # Get today's discussion
GET  /api/discussions/:id                 # Get specific discussion
POST /api/discussions                     # Create discussion
PUT  /api/discussions/:id                 # Update discussion
GET  /api/responses                       # Get all responses
GET  /api/responses/discussion/:id        # Get discussion responses
POST /api/responses                       # Create response
GET  /api/responses/:id                   # Get specific response
```

### Response Format Examples

**Discussion:**

```json
{
  "id": 1,
  "title": "Discussion Title",
  "content": "Discussion content here...",
  "date": "2024-01-09T00:00:00Z",
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

**User:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "active": true
}
```

## 🛠️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Backend
PORT=8080
NODE_ENV=development
SESSION_SECRET=your_secret_here

# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=daily_discussion

# Frontend
VITE_API_URL=http://localhost:8080/api
```

### API URL Configuration

Both clients automatically proxy to the backend during development. For production, update the API URL in:

- **User Client**: `src/client/hooks/useApi.js`
- **Admin Client**: `src/admin/hooks/useAdminApi.js`

## 📦 Dependencies

### Production

- React 18.2.0
- React DOM 18.2.0
- Axios 1.13.2
- Bootstrap 5.3.8

### Development

- Vite 5.0.8
- @vitejs/plugin-react 4.2.1

## 🎨 Styling

- **Bootstrap 5.3.8**: Base component styling
- **Custom CSS**: Glass-morphism effects, dark theme, animations
- **CSS Modules**: Component-specific styles where needed

### Color Scheme

**User Client:**

- Background: Dark blue (`#0b1220`)
- Glass: Semi-transparent with blur
- Accent: Cyan/Blue (`#81d4fa`)

**Admin Client:**

- Background: Very dark blue (`#020617`)
- Glass: Semi-transparent darker
- Accent: Cyan (`#38bdf8`)

## 🔍 State Management

Both clients use React Hooks for state management:

- `useState` for component state
- `useEffect` for side effects
- Custom hooks for API calls and data fetching

No external state management library needed - hooks keep it simple and performant.

## ⚙️ Vite Configuration

### User Client: `vite.config.js`

- Root: `src/client`
- Port: 5173
- Output: `dist/client`
- API Proxy: `/api` → `http://localhost:8080`

### Admin Client: `vite.admin.config.js`

- Root: `src/admin`
- Port: 5174
- Output: `dist/admin`
- API Proxy: `/api` → `http://localhost:8080`

## 🧪 Testing

Both clients include:

- Loading states
- Error handling
- Form validation
- API error recovery
- Toast notifications

## 🚨 Troubleshooting

### Port Already in Use

If port 5173 or 5174 is already in use, Vite will automatically try the next available port.

### CORS Issues

Ensure backend has proper CORS configuration. The dev servers automatically proxy API requests.

### Build Errors

- Clear `node_modules` and `dist` folders
- Run `npm install` again
- Check for TypeScript/ESLint errors

### API Not Responding

- Verify backend is running on port 8080
- Check API URL in respective `useApi.js` files
- Review browser console for detailed errors

## 📝 Component Documentation

### User Client Components

**App.jsx**

- Main container
- Manages active tabs and data fetching
- Handles toast notifications

**DiscussionCard.jsx**

- Displays discussion title and content
- Shows loading skeleton
- Includes reload button

**ResponsesList.jsx**

- List of all responses
- Response count badge
- Individual response items with timestamps

**ReplyComposer.jsx**

- Textarea with auto-sizing
- Character count
- Submit button with loading state
- Error handling

### Admin Client Components

**AdminApp.jsx**

- Main admin container
- Tab navigation
- Background overlay

**UsersTab.jsx**

- Users table
- Search functionality
- User roles and status display

**DiscussionsTab.jsx**

- Discussions list
- Create/Edit form
- Date selection

**ResponsesTab.jsx**

- Discussion filter dropdown
- Responses list
- Search functionality

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start development: `npm run dev:all`
3. ✅ User client: http://localhost:5173
4. ✅ Admin client: http://localhost:5174
5. ✅ Test all features
6. ✅ Build for production: `npm run build`

## 📞 Support

For issues or questions about the React migration:

- Check component prop types in source files
- Review API hook implementations
- Check browser console for detailed errors
- Verify backend API responses match expected format

---

**React Migration Complete!** 🎉

Both user and admin clients are fully functional and production-ready.
