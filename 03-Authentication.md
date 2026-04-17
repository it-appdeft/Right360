# 03 — Authentication System

## Purpose
Full user authentication system with registration, login, password recovery, JWT-based sessions, guest mode, and future OAuth support.

---

## Tech Stack

| Tool | Role |
|------|------|
| bcryptjs | Password hashing |
| jsonwebtoken | JWT token generation/verification |
| express-validator | Input validation |
| Zustand | Client-side auth state |
| Axios interceptors | Auto-attach JWT to requests |

---

## Features

### 3.1 Registration
- Fields: username, email, password, confirm password
- Validation: email format, password strength (min 8 chars, 1 uppercase, 1 number)
- Password hashing with bcrypt (salt rounds: 12)
- Duplicate email/username check
- Auto-login after registration (return JWT)

### 3.2 Login
- Fields: email, password
- JWT token returned on success (7-day expiry)
- Token stored in localStorage on client
- Failed login attempt tracking (future: lockout after 5 attempts)

### 3.3 Password Recovery
- Step 1: Enter email → send reset token (future: email integration)
- Step 2: Enter new password with reset token
- Reset token expires in 1 hour

### 3.4 Guest Mode
- No login required for basic usage
- Guest preferences saved in localStorage
- On registration, migrate localStorage data to MongoDB
- Limited features: no sync, no saved layouts across devices

### 3.5 OAuth (Future Phase)
- Google Sign-In
- Apple Sign-In
- Link OAuth account to existing email account

---

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Login, get JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |
| PUT | `/api/auth/profile` | Yes | Update profile |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Reset password with token |
| POST | `/api/auth/logout` | Yes | Invalidate session |

---

## JWT Token Structure

```json
{
  "payload": {
    "userId": "ObjectId",
    "email": "user@example.com",
    "role": "user"
  },
  "expiresIn": "7d"
}
```

---

## Frontend Components

### Pages
| Component | Route | Description |
|-----------|-------|-------------|
| `LoginPage` | `/login` | Email + password form |
| `RegisterPage` | `/register` | Registration form |
| `ForgotPasswordPage` | `/forgot-password` | Email input for reset |
| `ResetPasswordPage` | `/reset-password/:token` | New password form |

### Components
| Component | Description |
|-----------|-------------|
| `AuthForm` | Reusable form wrapper (login/register) |
| `ProtectedRoute` | Route guard — redirects to login if no token |
| `UserMenu` | Header dropdown (profile, settings, logout) |

---

## Zustand Auth Store (`useAuthStore.js`)

```js
{
  user: null,              // Current user object
  token: null,             // JWT token
  isAuthenticated: false,  // Quick check
  isGuest: true,           // Guest mode flag
  isLoading: false,        // Auth action in progress

  // Actions
  login(email, password),
  register(username, email, password),
  logout(),
  loadUser(),              // Check token on app mount
  updateProfile(data),
  migrateGuestData()       // Move localStorage → MongoDB on register
}
```

---

## Auth Flow

```
App Mount → Check localStorage for token
  ├─ Token found → Call GET /api/auth/me → Set user state
  ├─ Token expired → Clear token → Guest mode
  └─ No token → Guest mode

Login → POST /api/auth/login → Store token → Set user state
Register → POST /api/auth/register → Store token → Migrate guest data → Set user state
Logout → Clear token → Clear user state → Guest mode
```

---

## Axios Interceptor Setup

```js
// Auto-attach token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## Security Measures

- Passwords hashed with bcrypt (12 salt rounds)
- JWT secret stored in environment variable
- Token expiry: 7 days
- Rate limiting on auth routes: 10 requests/15 min
- Input sanitization on all fields
- HTTP-only cookies (future enhancement)

---

## Implementation Steps

1. Create `User` model with password hashing pre-save hook
2. Create `authController` with register/login/me handlers
3. Create `authRoutes` with validation middleware
4. Create JWT auth middleware (`middleware/auth.js`)
5. Create frontend `LoginPage` and `RegisterPage`
6. Create `useAuthStore` with Zustand
7. Set up Axios interceptors in `services/api.js`
8. Create `ProtectedRoute` component
9. Create `UserMenu` component for header
10. Implement guest mode with localStorage fallback
11. Test complete auth flow end-to-end

---

## Dependencies on Other Modules
- **Depends on**: `01-Project-Setup`, `02-Backend-API` (Express, Mongoose)
- **Required by**: `07-Personalization` (user sync), `06-Tile-System` (saved layouts)
