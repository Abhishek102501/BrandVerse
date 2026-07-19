# 🚀 DEPLOYMENT & BACKEND INTEGRATION GUIDE

---

## 📁 COMPLETE FOLDER STRUCTURE

```
brandverse/
├── public/
│   ├── favicon.ico
│   ├── manifest.json                 # PWA manifest (todo)
│   └── index.html                    # Main HTML entry point
│
├── src/
│   ├── app/
│   │   ├── providers/
│   │   │   ├── AppProviders.tsx      # Query, Theme, Toast setup
│   │   │   ├── ThemeProvider.tsx     # Theme initialization
│   │   │   └── QueryProvider.ts      # React Query configuration
│   │   ├── router/
│   │   │   ├── routes.tsx            # Route definitions (9 pages)
│   │   │   └── paths.ts              # Path constants
│   │   └── App.tsx                   # Root component with router
│   │
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   └── dropdown-menu.tsx
│   │   ├── layout/
│   │   │   ├── MainLayout.tsx        # Layout wrapper
│   │   │   ├── Navbar.tsx            # Navigation bar
│   │   │   ├── MobileNav.tsx         # Mobile menu
│   │   │   └── Footer.tsx            # Footer
│   │   ├── sections/                 # Page sections
│   │   │   ├── HeroSection.tsx
│   │   │   ├── FeaturedBrandsSection.tsx
│   │   │   ├── TrendingBrandsSection.tsx
│   │   │   ├── EditorPicksSection.tsx
│   │   │   └── CategoriesSection.tsx
│   │   ├── brand/
│   │   │   ├── BrandCard.tsx         # 3 variants
│   │   │   ├── SearchBar.tsx
│   │   │   └── Newsletter.tsx
│   │   ├── common/                   # Reusable utilities
│   │   │   ├── Container.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── PageTransition.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── LoadingScreen.tsx
│   │   └── theme/
│   │       └── ThemeToggle.tsx
│   │
│   ├── pages/                        # Page components (9 total)
│   │   ├── HomePage.tsx
│   │   ├── BrandsPage.tsx
│   │   ├── BrandDetailPage.tsx
│   │   ├── ComparePage.tsx
│   │   ├── FavoritesPage.tsx
│   │   ├── CategoriesPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── NotFoundPage.tsx
│   │
│   ├── services/                     # Service layer
│   │   └── brand/
│   │       ├── brand.types.ts        # Types & interfaces
│   │       ├── brand.service.ts      # Service selector
│   │       ├── brand.mock.service.ts # Mock implementation
│   │       └── brand.http.service.ts # HTTP implementation
│   │
│   ├── features/                     # Feature-based organization
│   │   └── brands/
│   │       ├── hooks/
│   │       │   ├── query-keys.ts     # React Query key factory
│   │       │   └── use-brands.ts     # 10 custom hooks
│   │       └── constants.ts          # Feature constants
│   │
│   ├── store/                        # Zustand stores (5 total)
│   │   ├── favorites.store.ts        # Favorite brands
│   │   ├── recently-viewed.store.ts  # View history
│   │   ├── search-history.store.ts   # Search queries
│   │   ├── theme.store.ts            # Dark/light mode
│   │   └── toast.store.ts            # Notifications
│   │
│   ├── hooks/                        # Custom React hooks
│   │   └── useScrollAnimation.ts
│   │
│   ├── lib/                          # Utilities
│   │   ├── axios.ts                  # HTTP client
│   │   ├── utils.ts                  # Helper functions
│   │   └── http-client.ts            # Shared config
│   │
│   ├── config/                       # Configuration
│   │   ├── site.ts                   # Site config
│   │   ├── env.ts                    # Environment variables
│   │   └── brand-api.ts              # API configuration
│   │
│   ├── types/                        # TypeScript definitions
│   │   └── index.ts                  # All types
│   │
│   ├── styles/
│   │   ├── globals.css               # Global styles
│   │   └── animations.css            # Custom animations
│   │
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Tailwind directives
│
├── tests/                            # Test files (future)
│   ├── hooks/
│   ├── components/
│   ├── services/
│   └── e2e/
│
├── docs/                             # Documentation (future)
│   ├── ARCHITECTURE.md
│   ├── COMPONENTS.md
│   ├── DEVELOPMENT.md
│   └── DEPLOYMENT.md
│
├── .env                              # Environment variables (local)
├── .env.example                      # Template
├── .env.production                   # Production variables
├── .gitignore
├── tsconfig.json                     # TypeScript config
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts                    # Vite configuration
├── tailwind.config.ts                # Tailwind configuration
├── postcss.config.js
├── components.json                   # shadcn/ui config
├── package.json
├── package-lock.json
├── README.md
├── SENIOR_REVIEW.md                  # ✅ Created
├── REMAINING_IMPROVEMENTS.md         # ✅ Created
└── DEPLOYMENT_GUIDE.md               # ✅ This file

Total: 60 files, 4,702 LOC
```

---

## 🔌 BACKEND API CONTRACT

### Base Configuration
```typescript
// Frontend .env
VITE_API_BASE_URL=http://api.example.com/api
VITE_USE_MOCK=false  // Set to false for production
```

### REST Endpoint Specifications

#### 1. GET `/brands`
List all brands with pagination and filtering

**Query Parameters**
```typescript
{
  page?: number              // Default: 1
  pageSize?: number          // Default: 10, Max: 100
  search?: string            // Search by name
  category?: string          // Filter by category
  minRating?: number         // Min rating (0-5)
  minSustainability?: number // Min sustainability score
  maxPrice?: number          // Max price
  sort?: string              // 'rating' | 'popularity' | 'trust' | 'sustainability'
}
```

**Response**
```typescript
{
  items: Brand[],
  page: number,
  pageSize: number,
  total: number,
  totalPages: number
}
```

**Example Request**
```bash
GET /api/brands?page=1&pageSize=20&category=sustainable&sort=rating
```

---

#### 2. GET `/brands/{slug}`
Get brand by URL slug

**Path Parameters**
```typescript
{
  slug: string  // URL-friendly identifier
}
```

**Response**
```typescript
Brand
```

**Example**
```bash
GET /api/brands/patagonia
```

---

#### 3. GET `/brands/id/{id}`
Get brand by UUID

**Path Parameters**
```typescript
{
  id: string  // UUID
}
```

**Response**
```typescript
Brand
```

---

#### 4. GET `/brands/featured`
Get featured brands

**Response**
```typescript
Brand[]  // Array of 4-5 featured brands
```

---

#### 5. GET `/categories`
Get all brand categories

**Response**
```typescript
BrandCategory[]
```

**Example Response**
```json
[
  { id: "1", name: "Sustainable", slug: "sustainable" },
  { id: "2", name: "Luxury", slug: "luxury" },
  { id: "3", name: "Streetwear", slug: "streetwear" }
]
```

---

#### 6. GET `/brands/compare`
Compare multiple brands

**Query Parameters**
```typescript
{
  slugs: string[]  // Array of brand slugs, max 4
}
```

**Example**
```bash
GET /api/brands/compare?slugs=nike,adidas,patagonia,allbirds
```

**Response**
```typescript
Brand[]  // Array of compared brands
```

---

#### 7. GET `/brands/search`
Search brands

**Query Parameters**
```typescript
{
  q: string       // Search query
  limit?: number  // Default: 10
}
```

**Response**
```typescript
Brand[]
```

**Example**
```bash
GET /api/brands/search?q=sustainable&limit=20
```

---

#### 8. GET `/brands/{slug}/similar`
Get similar brands

**Path Parameters**
```typescript
{
  slug: string
}
```

**Query Parameters**
```typescript
{
  limit?: number  // Default: 4
}
```

**Response**
```typescript
Brand[]
```

---

## 📦 DTO SPECIFICATIONS

### Brand DTO
```typescript
interface Brand {
  id: string                      // UUID
  slug: string                    // URL-friendly
  name: string
  logoUrl: string
  category: string
  country: string
  rating: number                  // 0-5
  reviewsCount: number
  popularity: number              // 0-100
  sustainabilityScore: number     // 0-100
  trustScore: number              // 0-100
  description?: string
  website?: string
  founded?: number
  tags?: string[]
}
```

### BrandQuery DTO
```typescript
interface BrandQuery {
  search?: string
  category?: string
  minRating?: number
  minSustainability?: number
  maxPrice?: number
  sort?: 'rating' | 'popularity' | 'trust' | 'sustainability'
  page?: number
  pageSize?: number
}
```

### Paginated Response DTO
```typescript
interface Paginated<T> {
  items: T[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}
```

### BrandCategory DTO
```typescript
interface BrandCategory {
  id: string
  name: string
  slug: string
  count?: number  // Number of brands in category
}
```

### Error Response DTO
```typescript
interface ApiError {
  status: number
  message: string
  timestamp?: string
  path?: string
  errors?: Record<string, string[]>  // Validation errors
}
```

---

## 🔐 AUTHENTICATION

### JWT Integration Point

```typescript
// src/lib/axios.ts
const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

// Add token to requests
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 responses
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken')
      window.location.href = '/login'  // Future login page
    }
    return Promise.reject(error)
  }
)
```

### Future Authentication Endpoints
```
POST /auth/login
POST /auth/register
POST /auth/refresh
GET  /auth/me
POST /auth/logout
```

---

## ⚙️ ENVIRONMENT VARIABLES

### Development (.env)
```bash
VITE_API_BASE_URL=http://localhost:8080/api
VITE_USE_MOCK=true
VITE_LOG_LEVEL=debug
```

### Production (.env.production)
```bash
VITE_API_BASE_URL=https://api.brandverse.com/api
VITE_USE_MOCK=false
VITE_LOG_LEVEL=error
VITE_SENTRY_DSN=https://...
VITE_ANALYTICS_ID=...
```

### Complete List (see below in next section)

---

## 🔄 MIGRATION CHECKLIST

### Before Launch
- [ ] Spring Boot backend implements all 8 endpoints
- [ ] Database seeded with brands data
- [ ] Error handling matches frontend expectations
- [ ] CORS configured to allow frontend domain
- [ ] JWT tokens working with frontend

### During Integration
1. **Update .env**
   ```bash
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://backend-url/api
   ```

2. **Test each endpoint**
   ```bash
   npm run dev
   # Verify each page loads real data
   ```

3. **Monitor errors**
   ```bash
   # Check browser console for API errors
   # Check Network tab for response status codes
   ```

4. **Verify data matching**
   ```bash
   # Ensure DTO fields match BrandService interface
   # Test pagination
   # Test filters
   # Test search
   ```

---

## 🚀 DEPLOYMENT

### Development
```bash
cd brandverse
npm install
npm run dev
# http://localhost:5173
```

### Production Build
```bash
npm run build
# Output: dist/
# Ready for deployment to:
# - Netlify
# - Vercel
# - AWS S3 + CloudFront
# - Docker container
# - Static file server
```

### Docker Deployment
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

### Environment Variables in Production
Set these in your deployment platform:
- `VITE_API_BASE_URL`
- `VITE_USE_MOCK`
- `VITE_SENTRY_DSN` (optional)
- `VITE_ANALYTICS_ID` (optional)

---

## ✅ INTEGRATION VERIFICATION

### Checklist
- [ ] All 8 endpoints implemented in Spring Boot
- [ ] Request/response DTOs match frontend expectations
- [ ] Pagination working correctly
- [ ] Search and filters working
- [ ] Error responses properly formatted
- [ ] CORS headers configured
- [ ] JWT authentication ready
- [ ] Database populated with test data
- [ ] Frontend set to production mode
- [ ] No console errors when fetching data

### Testing Commands
```bash
# Test API availability
curl http://localhost:8080/api/brands

# Test search
curl "http://localhost:8080/api/brands/search?q=nike"

# Test pagination
curl "http://localhost:8080/api/brands?page=1&pageSize=20"
```

---

## 📞 SUPPORT

### Frontend Troubleshooting

**Issue**: "Failed to fetch brands"
- Check VITE_API_BASE_URL in .env
- Verify backend is running
- Check CORS headers in backend
- Check browser Network tab

**Issue**: "Invalid data structure"
- Verify DTO matches BrandService interface
- Check response format is Paginated<Brand>
- Ensure all required fields present

**Issue**: "Authentication failed"
- Verify JWT token in localStorage
- Check Authorization header in request
- Verify token format: "Bearer {token}"
- Check token expiration

---

## 📚 BACKEND SPECIFICATION TEMPLATE

Share this with your backend team:

```
# BrandVerse Backend Specification

## Overview
REST API for BrandVerse fashion brand discovery platform.

## Endpoints (8 total)
1. GET /brands - List with filters
2. GET /brands/{slug} - Get by slug
3. GET /brands/id/{id} - Get by ID
4. GET /brands/featured - Featured list
5. GET /categories - Get categories
6. GET /brands/compare - Compare brands
7. GET /brands/search - Search brands
8. GET /brands/{slug}/similar - Similar brands

## DTOs (see above)
- Brand
- BrandQuery
- Paginated<T>
- BrandCategory
- ApiError

## Framework
- Spring Boot 3.x
- Spring Data JPA
- Spring Security JWT
- MySQL

## Validation
- All inputs validated
- Error messages in ApiError format
- Proper HTTP status codes

## Testing
- Unit tests for each endpoint
- Integration tests with database
- API documentation (Swagger)
```

---

**Next Step**: Implement Spring Boot backend and integrate!
