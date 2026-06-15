---
name: COMET LKW Vite Proxy
description: The Vite dev server must proxy /api/ to the API server port.
---

# Vite proxy for COMET LKW

The frontend (port 18454) and API server (port 8080) are separate services.

**Why:** Without a proxy, browser fetch calls to `/api/...` hit the Vite server (port 18454) and fail with 404.

**How to apply:**

Add to `vite.config.ts` server section:
```ts
proxy: {
  "/api": {
    target: "http://localhost:8080",
    changeOrigin: true,
    ws: true,  // enables Socket.IO WebSocket proxying
  },
},
```

The `ws: true` flag is needed for Socket.IO connections through the proxy.
Socket.IO server path is set to `/api/socket.io` in the server index.ts, and the client must set `path: "/api/socket.io"` to match.
