# API Setup Guide

This project now includes Axios and Vue Query (TanStack Query) for making API calls, with JWT token authentication using cookies.

## Configuration

### Environment Variables
Create a `.env.local` file in your project root with:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Vue Tailwind Admin Dashboard
VITE_JWT_ACCESS_TOKEN_EXPIRY=15m
VITE_JWT_REFRESH_TOKEN_EXPIRY=7d
```

### API Base URL
The default API base URL is `http://localhost:3000/api`. You can change this by setting the `VITE_API_BASE_URL` environment variable.

## JWT Token System

### Token Types
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (7 days) for renewing access tokens

### Storage
- Tokens are stored in **HTTP-only cookies** for security
- Expiration times are tracked in localStorage for client-side validation
- Automatic token refresh on 401 errors

## Usage

### Authentication Service
Use the authentication service for login, registration, and user management:

```typescript
import authService from '@/services/authService'

// Login
const result = await authService.login({ email, password })

// Register
const result = await authService.register({ name, email, password })

// Logout
const result = await authService.logout()

// Check authentication status
const isAuth = authService.isAuthenticated()

// Get token expiration times
const accessExpiry = authService.getAccessTokenExpiration()
const refreshExpiry = authService.getRefreshTokenExpiration()
```

### Vue Query Composable
Use the `useAuthQuery` composable for better state management and caching:

```typescript
import { useAuthQuery } from '@/composables/useAuthQuery'

const { 
  login, 
  register, 
  logout, 
  user, 
  isLoading, 
  error,
  getAccessTokenExpiration,
  getRefreshTokenExpiration 
} = useAuthQuery()
```

### Direct Axios Usage
You can also use the configured Axios instance directly:

```typescript
import api from '@/plugins/axios'

// GET request
const response = await api.get('/users')

// POST request
const response = await api.post('/users', { name, email })

// PUT request
const response = await api.put('/users/1', { name: 'New Name' })

// DELETE request
const response = await api.delete('/users/1')
```

## Features

- **JWT Token Authentication**: Secure token-based authentication
- **Automatic Token Refresh**: Tokens are automatically refreshed on expiration
- **Cookie Storage**: Tokens stored in secure HTTP-only cookies
- **Expiration Management**: Client-side expiration tracking and validation
- **Request/Response Interceptors**: Automatic token handling and error management
- **Vue Query Integration**: Automatic caching, background updates, and error handling
- **TypeScript Support**: Full type safety for API responses

## API Endpoints

The service expects these endpoints:

- `POST /auth/login` - User login (returns access_token, refresh_token)
- `POST /auth/register` - User registration (returns access_token, refresh_token)
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/refresh` - Refresh access token using refresh token

## Token Flow

1. **Login/Register**: Server returns access_token and refresh_token
2. **API Requests**: Access token automatically added to Authorization header as `JWT {token}`
3. **Token Expiry**: On 401 error, system automatically tries to refresh using refresh token
4. **Auto-refresh**: If refresh succeeds, original request is retried with new token
5. **Logout**: All tokens are cleared from cookies and localStorage

## Error Handling

All API calls return a standardized response format:

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
```

## Security Features

- **HTTP-only Cookies**: Prevents XSS attacks on tokens
- **Secure Flag**: Cookies only sent over HTTPS
- **SameSite**: Prevents CSRF attacks
- **Automatic Cleanup**: Expired tokens are automatically removed
- **Token Rotation**: Refresh tokens are rotated on each use

## Cookie Configuration

Cookies are configured with:
- `secure`: Only sent over HTTPS
- `samesite=strict`: Prevents CSRF attacks
- `httpOnly`: Prevents JavaScript access
- Automatic expiration based on token lifetime
