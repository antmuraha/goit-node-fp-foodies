import request from "supertest";
import { app, db } from "../app.js";

afterAll(async () => {
  await db.sequelize.close();
});

describe("GET /api/categories", () => {
  it("responds with 200 and a JSON array", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("returns categories with required fields", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.body.length).toBeGreaterThan(0);
    const category = res.body[0];
    expect(category).toHaveProperty("id");
    expect(category).toHaveProperty("name");
    expect(category).toHaveProperty("image");
    expect(category).toHaveProperty("createdAt");
    expect(category).toHaveProperty("updatedAt");
  });

  it("returns categories sorted by name ascending", async () => {
    const res = await request(app).get("/api/categories");

    const names = res.body.map((c) => c.name);
    expect(names).toEqual([...names].sort());
  });

  it("sets Cache-Control header", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.headers["cache-control"]).toBe("public, max-age=3600, stale-while-revalidate=86400");
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/api/categories");

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/unknown");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Route not found" });
  });
});
