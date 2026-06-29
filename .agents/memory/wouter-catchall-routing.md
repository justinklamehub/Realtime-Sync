---
name: Wouter catch-all routing
description: path="/:path*" only matches single-segment paths in Wouter+regexparam; use path="*" for true catch-all.
---

## Rule
In a Wouter `<Switch>`, use `path="*"` for the catch-all route — never `path="/:path*"`.

**Why:**
regexparam (the parser Wouter uses) compiles `/:path*` into `/^\/([^/]+?)\/?$/i` because the colon-branch of its parser emits `([^/]+?)` (non-greedy, no-slash matcher) regardless of the trailing `*`. The `*` suffix just becomes part of the key name, not a glob. This means `/:path*` matches exactly ONE path segment. Two-segment paths like `/shipments/kanban` never match, so the Switch returns `null` → completely blank page (no sidebar, no layout).

`path="*"` is the standalone-star case in regexparam (`c === '*'`) which emits `(.*)` → regex `/^\/(.*)\/?$/i` → matches any number of segments.

**How to apply:**
- Outer Switch catch-all: `<Route path="*"><AppLayout>...</AppLayout></Route>`
- Single-segment named routes still work fine (e.g. `path="/dashboard"`)
- Explicit multi-segment routes (e.g. `path="/scanner/gefahrgut"`) also work fine — they use literal string matching
- Only the WILDCARD catch-all at the end of a Switch is affected
