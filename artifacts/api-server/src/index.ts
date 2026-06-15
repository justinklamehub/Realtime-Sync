import { createServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import app, { sessionMiddleware } from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/api/socket.io",
});

app.set("io", io);

io.use((socket, next) => {
  sessionMiddleware(socket.request as any, {} as any, next as any);
});

io.on("connection", (socket) => {
  const sess = (socket.request as any).session;
  const role: string | undefined = sess?.role;
  const speditionId: number | undefined = sess?.speditionId;

  const isCometRole =
    role !== undefined &&
    ["comet_admin", "comet_leitstand", "comet_lager", "comet_viewer"].includes(role);

  if (isCometRole) {
    socket.join("comet");
  } else if (speditionId) {
    socket.join(`spedition:${speditionId}`);
  }

  logger.info({ socketId: socket.id, role, speditionId }, "Socket.IO client connected");

  socket.on("disconnect", () => {
    logger.info({ socketId: socket.id }, "Socket.IO client disconnected");
  });
});

httpServer.listen(port, (err?: Error) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }
  logger.info({ port }, "Server listening with Socket.IO");
});
