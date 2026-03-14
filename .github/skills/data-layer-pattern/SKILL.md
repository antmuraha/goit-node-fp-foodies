---
name: data-layer-pattern
description: "Implement and extend the frontend abstract data layer: typed API client, route constants, entity types, Redux async thunks, and useData* hooks."
---

# Skill: Data Layer Pattern

## Description

This project uses a Redux-backed abstract data layer on the frontend. All remote data access flows through typed endpoint wrappers, async thunks, and `useData*` hooks — never via raw `fetch` calls inside components.

Representative implementations already exist for users, profile, and recipes.

## Architectural Constraints

- **Required**: All HTTP calls go through `api/endpoints/` wrapper functions
- **Required**: Route strings are defined in `shared/constants/apiRoutes.ts`
- **Required**: Async state lives in Redux slices (`store/slices/`)
- **Required**: Components access remote data only through `useData*` hooks
- **Forbidden**: `fetch` or `axios` calls directly in components, slices, or page files
- **Forbidden**: Hardcoded URL strings in endpoint wrappers or hooks
- **Layer order**: `page/widget` → `useData*` hook → Redux slice → `api/endpoints/` → `apiClient`

## Trigger Examples

- "Add a new data hook for categories"
- "Implement a useDataFollowers hook"
- "Wire up the testimonials endpoint"
- "Add Redux slice for areas"
- "Expose areas list to page components"

## Implementation Steps

### 1. Add route constants

Add typed route constants in `shared/constants/apiRoutes.ts`:

```ts
export const API_ROUTES = {
  // ...
  AREAS: {
    BASE: '/areas',
    BY_ID: (id: number) => `/areas/${id}`,
  },
};
```

### 2. Define entity types

Add or extend model types in `entities/<entity>/model/types.ts` and re-export from `entities/<entity>/index.ts`:

```ts
export interface AreaItem {
  id: number;
  name: string;
}
```

### 3. Implement endpoint wrapper

Create or extend `api/endpoints/<entity>Api.ts`:

```ts
import { apiClient } from '../client';
import { API_ROUTES } from '../../shared/constants/apiRoutes';
import type { AreaItem } from '../../entities/area';

export const areasApi = {
  getAreas: () => apiClient.get<AreaItem[]>(API_ROUTES.AREAS.BASE),
};
```

### 4. Add Redux slice

Add async thunks and state in `store/slices/<entity>Slice.ts`:

```ts
export const fetchAreas = createAsyncThunk('areas/fetchAll', () =>
  areasApi.getAreas()
);
```

Include `idle | loading | succeeded | failed` status tracking and expose slice actions for reset.

### 5. Create `useData*` hook

Create `shared/hooks/useData<Entity>.ts` returning a stable interface:

```ts
return { areas, isLoading, error, loadAreas };
```

Auto-fetch on `idle` status; expose explicit load action for manual control.

### 6. Export and integrate

- Export from `shared/hooks/index.ts`
- Use in page or widget component via the hook only — no direct dispatch or API calls in JSX

## Optional Validation Snippets

```bash
# Check for raw fetch calls in component/page files
rg "fetch\(" frontend/src --glob '**/*.{ts,tsx}' --glob '!**/api/**'

# Check for hardcoded /api strings outside apiRoutes
rg "'/api/|\"/api/" frontend/src --glob '**/*.{ts,tsx}' --glob '!**/constants/**'

# Verify all useData* hooks are exported from barrel
grep "useData" frontend/src/shared/hooks/index.ts
```

## Expected Outputs

- Route constants entry in `shared/constants/apiRoutes.ts`
- Entity types in `entities/<entity>/model/types.ts` with barrel export
- Endpoint wrapper in `api/endpoints/<entity>Api.ts`
- Redux slice with async thunks and `AsyncStatus` state  
- `useData<Entity>` hook with `data`, `isLoading`, `error`, and explicit load action
- Hook exported from `shared/hooks/index.ts`
- Page or widget consuming the hook

## Validation Checklist

- [ ] No raw `fetch` inside component or page files
- [ ] All route strings defined in `shared/constants/apiRoutes.ts`
- [ ] Entity types defined and barrel-exported
- [ ] Endpoint wrapper uses `apiClient` and typed route constants
- [ ] Slice has `idle | loading | succeeded | failed` status tracking
- [ ] Hook returns stable `{ data, isLoading, error, load* }` shape
- [ ] Hook exported from `shared/hooks/index.ts`

## Known Backend Limitations

The backend does not yet expose `/api/users` and `/api/auth/me`. The frontend layer is ready; until those routes exist, `useDataUsers`, `useDataUser`, and `useDataProfile` will return API errors at runtime.

## Related Skills

- `manage-centralized-constants` — route and config constant governance
- `implement-dependency-adapter-layer` — adapter pattern for external services
- `enforce-clean-code-principles` — function scope and responsibility
- `validate-import-paths` — FSD layer import boundaries
