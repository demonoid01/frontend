# API Configuration Setup

## Configuration

The application is configured to always use the production API at `https://demonoid.in:3542`.

## What This Setup Provides

### 1. **Centralized API Configuration** (`src/utils/config.ts`)
- Fixed production base URL: `https://demonoid.in:3542`
- Predefined API endpoints
- Helper functions for building API URLs

### 2. **Enhanced API Client** (`src/utils/helper.tsx`)
- Automatic URL building using config
- Timeout handling (30 seconds default)
- Better error handling with try-catch
- Convenience methods: `apiGet`, `apiPost`, `apiPut`, `apiDelete`

### 3. **Next.js Configuration** (`next.config.mjs`)
- Image domain whitelisting for `demonoid.in`
- Optimized for production use

### 4. **Usage Examples**

#### Before (Hardcoded URLs):
```typescript
const categories = await apiClient<Category[]>('https://demonoid.in:3542/categories/');
const topVideo = await apiClient<heroVideo[]>('https://demonoid.in:3542/hero');
```

#### After (Using Config):
```typescript
import { apiGet } from '@/utils/helper';
import { apiConfig } from '@/utils/config';

const categories = await apiGet<Category[]>(apiConfig.endpoints.categories);
const heroVideo = await apiGet<heroVideo[]>(apiConfig.endpoints.hero);
```

## Benefits

1. **Centralized Management**: All API endpoints in one place
2. **Better Error Handling**: Timeout and network error management
3. **Type Safety**: Full TypeScript support
4. **Consistent API Calls**: Standardized error handling and timeouts
5. **Production Ready**: Always uses production API
6. **Maintainable**: Easy to add new endpoints and modify existing ones

## API Endpoints Available

- `categories` - `/categories/`
- `hero` - `/hero`
- `products` - `/products`
- `orders` - `/orders`
- `users` - `/users`
- `auth` - `/auth`

## Adding New Endpoints

1. Add to `apiConfig.endpoints` in `src/utils/config.ts`
2. Use `buildApiUrl()` helper function
3. Import and use with `apiGet`, `apiPost`, etc.

## Current Base URL

**Production API**: `https://demonoid.in:3542`

All API calls will automatically use this base URL with the configured endpoints.
