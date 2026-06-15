---
name: COMET LKW Auth
description: Session-based auth setup for the COMET LKW app — gotchas and requirements.
---

# Session-based auth for COMET LKW

The app uses express-session + bcryptjs (no JWT).

**Why:** Session cookies are the chosen approach so the browser automatically manages auth state.

**How to apply:**

1. `connect-pg-simple` requires the `session` table to exist. The `createTableIfMissing: true` option was unreliable — create it manually:
   ```sql
   CREATE TABLE IF NOT EXISTS session (
     sid varchar NOT NULL COLLATE "default",
     sess json NOT NULL,
     expire timestamp(6) NOT NULL,
     CONSTRAINT session_pkey PRIMARY KEY (sid)
   );
   CREATE INDEX IF NOT EXISTS IDX_session_expire ON session (expire);
   ```

2. `customFetch` in `lib/api-client-react/src/custom-fetch.ts` must include `credentials: "include"` so browser sessions work:
   ```js
   const response = await fetch(input, { credentials: "include", ...init, method, headers });
   ```

3. The `queryKey` option is required when passing any options to orval-generated hooks (TypeScript will fail otherwise). Use the generated key helpers: `getGetMeQueryKey()`, etc.
