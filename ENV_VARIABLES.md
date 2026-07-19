# ⚙️ ENVIRONMENT VARIABLES REFERENCE

---

## 📋 COMPLETE ENVIRONMENT VARIABLES LIST

### Development Environment (.env)

```bash
# ============================================
# API CONFIGURATION
# ============================================

# API Base URL (where Spring Boot will be)
VITE_API_BASE_URL=http://localhost:8080/api

# Use mock data instead of API (true for dev, false for production)
VITE_USE_MOCK=true

# Log level (debug, info, warn, error)
VITE_LOG_LEVEL=debug


# ============================================
# IMAGE & MEDIA (Future)
# ============================================

# CDN Base URL for images (optional)
# VITE_IMAGE_CDN_BASE=https://cdn.example.com/images/

# Image optimization (optional)
# VITE_IMAGE_QUALITY=80


# ============================================
# ANALYTICS & MONITORING (Future)
# ============================================

# Sentry error tracking (optional)
# VITE_SENTRY_DSN=https://key@sentry.io/project

# Analytics service ID (optional)
# VITE_ANALYTICS_ID=GA_ID

# Analytics enabled flag
# VITE_ENABLE_ANALYTICS=true


# ============================================
# AUTHENTICATION (Future)
# ============================================

# Auth0 or other OAuth provider (optional)
# VITE_AUTH_PROVIDER=auth0
# VITE_AUTH_DOMAIN=your-domain.auth0.com
# VITE_AUTH_CLIENT_ID=your_client_id


# ============================================
# FEATURE FLAGS
# ============================================

# Enable PWA features (optional)
# VITE_ENABLE_PWA=false

# Enable dark mode (always enabled currently)
VITE_ENABLE_DARK_MODE=true

# Enable experimental features
# VITE_ENABLE_EXPERIMENTS=false
```

---

### Production Environment (.env.production)

```bash
# ============================================
# API CONFIGURATION (PRODUCTION)
# ============================================

# Production API URL (required)
VITE_API_BASE_URL=https://api.brandverse.com/api

# Disable mock data in production (required)
VITE_USE_MOCK=false

# Production log level
VITE_LOG_LEVEL=error


# ============================================
# IMAGE & MEDIA
# ============================================

# Production CDN
VITE_IMAGE_CDN_BASE=https://cdn.brandverse.com/images/

# Image optimization for production
VITE_IMAGE_QUALITY=85


# ============================================
# MONITORING & ANALYTICS
# ============================================

# Sentry for error tracking
VITE_SENTRY_DSN=https://examplePublicKey@o0.ingest.sentry.io/0

# Google Analytics
VITE_ANALYTICS_ID=G-XXXXXXXXXX

# Enable analytics
VITE_ENABLE_ANALYTICS=true


# ============================================
# AUTHENTICATION
# ============================================

# OAuth provider configuration
# VITE_AUTH_PROVIDER=auth0
# VITE_AUTH_DOMAIN=brandverse.auth0.com
# VITE_AUTH_CLIENT_ID=production_client_id


# ============================================
# FEATURE FLAGS
# ============================================

# PWA enabled in production
VITE_ENABLE_PWA=true

# Dark mode enabled
VITE_ENABLE_DARK_MODE=true

# Enable experiments in production
VITE_ENABLE_EXPERIMENTS=false
```

---

### Testing Environment (.env.test)

```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=true
VITE_LOG_LEVEL=debug
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_PWA=false
```

---

## 🔧 HOW TO USE

### 1. Create .env File
```bash
cd brandverse
cp .env.example .env
# Edit .env with your local values
```

### 2. Load Environment Variables
```typescript
// src/config/env.ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
  logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  imageQuality: import.meta.env.VITE_IMAGE_QUALITY || '80',
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
}

// Usage in app
import { env } from '@/config/env'
const apiUrl = env.apiBaseUrl
```

### 3. Access in Components
```typescript
// Accessing environment variables
const isProduction = !import.meta.env.VITE_USE_MOCK
const apiUrl = import.meta.env.VITE_API_BASE_URL

// Type-safe approach (recommended)
import { env } from '@/config/env'
const isDev = !env.useMock
```

---

## 🚀 DEPLOYMENT SETUP

### Netlify
Set environment variables in:
```
Site settings → Build & deploy → Environment
```

### Vercel
Set environment variables in:
```
Settings → Environment Variables
```

### Docker
```dockerfile
ENV VITE_API_BASE_URL=https://api.example.com/api
ENV VITE_USE_MOCK=false
ENV VITE_LOG_LEVEL=error
```

### AWS S3 + CloudFront
```bash
# Build with env variables
VITE_API_BASE_URL=https://api.example.com/api \
VITE_USE_MOCK=false \
npm run build
```

---

## ✅ REQUIRED vs OPTIONAL

| Variable | Required | Default | Notes |
|----------|----------|---------|-------|
| VITE_API_BASE_URL | ✅ | - | Must be set before production |
| VITE_USE_MOCK | ✅ | true | Set to false for production |
| VITE_LOG_LEVEL | ❌ | info | Optional, for debugging |
| VITE_IMAGE_CDN_BASE | ❌ | - | Optional, for optimization |
| VITE_SENTRY_DSN | ❌ | - | Optional, for error tracking |
| VITE_ANALYTICS_ID | ❌ | - | Optional, for analytics |
| VITE_AUTH_PROVIDER | ❌ | - | Optional, for auth |
| VITE_ENABLE_PWA | ❌ | false | Optional, future feature |
| VITE_ENABLE_DARK_MODE | ❌ | true | Optional, enabled by default |

---

## 🔒 SECURITY NOTES

### Do NOT commit to git:
```bash
# .gitignore
.env
.env.local
.env.*.local
```

### Safe to commit:
```bash
.env.example  # Template only
```

### For public values:
```bash
# These are safe (public keys, not secrets)
VITE_API_BASE_URL=https://api.example.com/api
VITE_ANALYTICS_ID=GA_ID
VITE_IMAGE_CDN_BASE=https://cdn.example.com/
```

### Never expose:
```bash
# Secrets - use server-side only
VITE_DATABASE_PASSWORD=...
VITE_PRIVATE_KEY=...
VITE_API_SECRET_KEY=...
```

---

## 📝 CHECKLIST FOR DEPLOYMENT

- [ ] Create .env.production file
- [ ] Set VITE_API_BASE_URL to production backend
- [ ] Set VITE_USE_MOCK=false
- [ ] Set VITE_LOG_LEVEL=error
- [ ] Set VITE_SENTRY_DSN if using error tracking
- [ ] Set VITE_ANALYTICS_ID if using analytics
- [ ] Test all pages load data correctly
- [ ] Verify no API calls to localhost
- [ ] Check browser console for errors
- [ ] Verify dark/light mode works
- [ ] Test on multiple devices

---

## 🐛 TROUBLESHOOTING

### "VITE_API_BASE_URL is not set"
```bash
# Solution: Create .env file with:
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=true
```

### "API calls failing (404)"
```bash
# Check:
1. Is backend running?
2. Is VITE_API_BASE_URL correct?
3. Are endpoints implemented?
4. Check Network tab in DevTools
```

### "Mock data not showing"
```bash
# Verify in .env:
VITE_USE_MOCK=true
```

### "Analytics not tracking"
```bash
# Set in .env.production:
VITE_ANALYTICS_ID=GA_ID
VITE_ENABLE_ANALYTICS=true
```

---

## 📚 ENVIRONMENT VARIABLE REFERENCES

### Vite Environment Variables
- https://vitejs.dev/guide/env-and-mode.html

### React with TypeScript
- https://vitejs.dev/guide/ssr.html#setting-up-the-dev-server

### Best Practices
- Keep .env files out of git
- Use .env.example for templates
- Document all variables
- Use type-safe env access
- Validate on app startup

---

**Summary**: Use .env for development, set production variables in deployment platform.
