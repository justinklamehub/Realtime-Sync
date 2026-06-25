import { Router } from "express";
import { db, ticketsTable, ticketCommentsTable, usersTable } from "@workspace/db";
import { eq, desc, and, or, sql } from "drizzle-orm";

const router = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!req.session?.userId) return res.status(401).json({ error: "Nicht angemeldet" });
  next();
}

function requireAdmin(req: any, res: any, next: any) {
  if (!req.session?.userId) return res.status(401).json({ error: "Nicht angemeldet" });
  if (!["comet_admin", "comet_leitstand"].includes(req.session.role)) {
    return res.status(403).json({ error: "Keine Berechtigung" });
  }
  next();
}

router.get("/tickets", requireAuth, async (req: any, res) => {
  try {
    const { status, category, priority } = req.query;

    const conditions: any[] = [];
    if (status) conditions.push(eq(ticketsTable.status, status as string));
    if (category) conditions.push(eq(ticketsTable.category, category as string));
    if (priority) conditions.push(eq(ticketsTable.priority, priority as string));

    const rows = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        status: ticketsTable.status,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        shipmentId: ticketsTable.shipmentId,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
        createdByUsername: usersTable.username,
      })
      .from(ticketsTable)
      .leftJoin(usersTable, eq(ticketsTable.createdBy, usersTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(
        sql`CASE
          WHEN ${ticketsTable.priority} = 'Kritisch' THEN 1
          WHEN ${ticketsTable.priority} = 'Hoch' THEN 2
          WHEN ${ticketsTable.priority} = 'Mittel' THEN 3
          ELSE 4
        END`,
        desc(ticketsTable.createdAt)
      );

    const commentCounts = await db
      .select({
        ticketId: ticketCommentsTable.ticketId,
        count: sql<number>`count(*)::int`,
      })
      .from(ticketCommentsTable)
      .groupBy(ticketCommentsTable.ticketId);

    const countMap = new Map(commentCounts.map((c) => [c.ticketId, c.count]));
    const result = rows.map((r) => ({ ...r, commentCount: countMap.get(r.id) ?? 0 }));

    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Laden der Tickets" });
  }
});

router.post("/tickets", requireAuth, async (req: any, res) => {
  try {
    const { title, description, category, priority, shipmentId } = req.body;
    if (!title?.trim() || !description?.trim()) {
      return res.status(400).json({ error: "Titel und Beschreibung sind Pflichtfelder" });
    }

    const [ticket] = await db
      .insert(ticketsTable)
      .values({
        title: title.trim(),
        description: description.trim(),
        category: category || "System",
        priority: priority || "Mittel",
        status: "Offen",
        createdBy: req.session.userId,
        shipmentId: shipmentId || null,
      })
      .returning();

    res.status(201).json(ticket);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Erstellen des Tickets" });
  }
});

router.get("/tickets/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);

    const [ticket] = await db
      .select({
        id: ticketsTable.id,
        title: ticketsTable.title,
        description: ticketsTable.description,
        category: ticketsTable.category,
        priority: ticketsTable.priority,
        status: ticketsTable.status,
        createdBy: ticketsTable.createdBy,
        assignedTo: ticketsTable.assignedTo,
        shipmentId: ticketsTable.shipmentId,
        createdAt: ticketsTable.createdAt,
        updatedAt: ticketsTable.updatedAt,
        createdByUsername: usersTable.username,
      })
      .from(ticketsTable)
      .leftJoin(usersTable, eq(ticketsTable.createdBy, usersTable.id))
      .where(eq(ticketsTable.id, id));

    if (!ticket) return res.status(404).json({ error: "Ticket nicht gefunden" });

    const comments = await db
      .select({
        id: ticketCommentsTable.id,
        ticketId: ticketCommentsTable.ticketId,
        userId: ticketCommentsTable.userId,
        body: ticketCommentsTable.body,
        createdAt: ticketCommentsTable.createdAt,
        username: usersTable.username,
      })
      .from(ticketCommentsTable)
      .leftJoin(usersTable, eq(ticketCommentsTable.userId, usersTable.id))
      .where(eq(ticketCommentsTable.ticketId, id))
      .orderBy(ticketCommentsTable.createdAt);

    res.json({ ...ticket, comments });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler" });
  }
});

router.patch("/tickets/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId as number;
    const role = req.session.role as string;

    const [existing] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
    if (!existing) return res.status(404).json({ error: "Ticket nicht gefunden" });

    const canManage = ["comet_admin", "comet_leitstand"].includes(role);
    const isOwner = existing.createdBy === userId;

    if (!canManage && !isOwner) {
      return res.status(403).json({ error: "Keine Berechtigung" });
    }

    const allowed: Record<string, any> = {};
    const { status, priority, assignedTo, title, description } = req.body;

    if (canManage) {
      if (status !== undefined) allowed.status = status;
      if (priority !== undefined) allowed.priority = priority;
      if (assignedTo !== undefined) allowed.assignedTo = assignedTo;
    }
    if (isOwner || canManage) {
      if (title !== undefined) allowed.title = title;
      if (description !== undefined) allowed.description = description;
    }

    allowed.updatedAt = new Date();

    const [updated] = await db
      .update(ticketsTable)
      .set(allowed)
      .where(eq(ticketsTable.id, id))
      .returning();

    res.json(updated);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Aktualisieren" });
  }
});

router.delete("/tickets/:id", requireAuth, async (req: any, res) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.session.userId as number;
    const role = req.session.role as string;

    const [existing] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, id));
    if (!existing) return res.status(404).json({ error: "Ticket nicht gefunden" });

    const canDelete = ["comet_admin"].includes(role) || existing.createdBy === userId;
    if (!canDelete) return res.status(403).json({ error: "Keine Berechtigung" });

    await db.delete(ticketCommentsTable).where(eq(ticketCommentsTable.ticketId, id));
    await db.delete(ticketsTable).where(eq(ticketsTable.id, id));

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Loeschen" });
  }
});

router.post("/tickets/:id/comments", requireAuth, async (req: any, res) => {
  try {
    const ticketId = parseInt(req.params.id);
    const userId = req.session.userId as number;
    const { body } = req.body;

    if (!body?.trim()) return res.status(400).json({ error: "Kommentar darf nicht leer sein" });

    const [existing] = await db.select().from(ticketsTable).where(eq(ticketsTable.id, ticketId));
    if (!existing) return res.status(404).json({ error: "Ticket nicht gefunden" });

    const [comment] = await db
      .insert(ticketCommentsTable)
      .values({ ticketId, userId, body: body.trim() })
      .returning();

    await db
      .update(ticketsTable)
      .set({ updatedAt: new Date() })
      .where(eq(ticketsTable.id, ticketId));

    res.status(201).json({ ...comment, username: req.session.username });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler beim Speichern des Kommentars" });
  }
});

router.delete("/tickets/:id/comments/:commentId", requireAuth, async (req: any, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.session.userId as number;
    const role = req.session.role as string;

    const [comment] = await db
      .select()
      .from(ticketCommentsTable)
      .where(eq(ticketCommentsTable.id, commentId));

    if (!comment) return res.status(404).json({ error: "Kommentar nicht gefunden" });

    const canDelete = ["comet_admin"].includes(role) || comment.userId === userId;
    if (!canDelete) return res.status(403).json({ error: "Keine Berechtigung" });

    await db.delete(ticketCommentsTable).where(eq(ticketCommentsTable.id, commentId));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Fehler" });
  }
});

export default router;
