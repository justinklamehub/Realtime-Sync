---
name: Auth public routes
description: How to add unauthenticated/public routes that bypass the login redirect in COMET LKW
---

The `AuthProvider` in `artifacts/comet-lkw/src/contexts/auth-context.tsx` has a `useEffect` that redirects any unauthenticated user to `/login`. Public routes (e.g. scanner pages) must be explicitly whitelisted.

**The rule:** Add the route prefix to the `isPublicRoute` check:
```ts
const isPublicRoute = location === "/login" || location.startsWith("/scanner");
```

**Why:** The redirect effect runs for every route, so any new public/kiosk/scanner page will silently show the login screen until added here.

**How to apply:** Whenever adding a new route that should be accessible without login, update the `isPublicRoute` condition in `auth-context.tsx`.
