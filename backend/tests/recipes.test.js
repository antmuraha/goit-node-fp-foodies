import request from "supertest";
import { app, db } from "../app.js";

afterAll(async () => {
  await db.sequelize.close();
});

describe("GET /api/recipes", () => {
  it("responds with 200 and expected shape", async () => {
    const res = await request(app).get("/api/recipes");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("total");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("offset");
    expect(Array.isArray(res.body.recipes)).toBe(true);
  });

  it("returns recipes with required fields", async () => {
    const res = await request(app).get("/api/recipes");

    if (res.body.recipes.length === 0) return;

    const recipe = res.body.recipes[0];
    expect(recipe).toHaveProperty("id");
    expect(recipe).toHaveProperty("name");
    expect(recipe).toHaveProperty("createdAt");
    expect(recipe).toHaveProperty("updatedAt");
  });

  it("respects limit and offset pagination params", async () => {
    const res = await request(app).get("/api/recipes?limit=3&offset=0");

    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(3);
    expect(res.body.offset).toBe(0);
    expect(res.body.recipes.length).toBeLessThanOrEqual(3);
  });

  it("enforces max limit of 100", async () => {
    const res = await request(app).get("/api/recipes?limit=999");

    expect(res.status).toBe(200);
    expect(res.body.limit).toBe(100);
  });

  it("filters by categoryId", async () => {
    const categoriesRes = await request(app).get("/api/categories");
    if (categoriesRes.body.length === 0) return;

    const categoryId = categoriesRes.body[0].id;
    const res = await request(app).get(`/api/recipes?categoryId=${categoryId}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.recipes)).toBe(true);
    res.body.recipes.forEach((r) => {
      expect(r.categoryId).toBe(categoryId);
    });
  });

  it("filters by search term (case insensitive)", async () => {
    const res = await request(app).get("/api/recipes?search=cake");

    expect(res.status).toBe(200);
    res.body.recipes.forEach((r) => {
      expect(r.name.toLowerCase()).toContain("cake");
    });
  });

  it("sets Cache-Control header", async () => {
    const res = await request(app).get("/api/recipes");

    expect(res.headers["cache-control"]).toBe("public, max-age=300, stale-while-revalidate=600");
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/api/recipes");

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});

describe("GET /api/recipes/:id", () => {
  it("returns 404 for a non-existent recipe", async () => {
    const res = await request(app).get("/api/recipes/9999999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: "Recipe not found" });
  });

  it("returns 400 for an invalid id", async () => {
    const res = await request(app).get("/api/recipes/abc");

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
  });

  it("returns full recipe with relations for a valid id", async () => {
    const listRes = await request(app).get("/api/recipes?limit=1");
    if (listRes.body.recipes.length === 0) return;

    const id = listRes.body.recipes[0].id;
    const res = await request(app).get(`/api/recipes/${id}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("id", id);
    expect(res.body).toHaveProperty("name");
    expect(res.body).toHaveProperty("instructions");
    expect(Array.isArray(res.body.Ingredients)).toBe(true);
    expect(Array.isArray(res.body.Areas)).toBe(true);
  });

  it("sets Cache-Control header for detail", async () => {
    const listRes = await request(app).get("/api/recipes?limit=1");
    if (listRes.body.recipes.length === 0) return;

    const id = listRes.body.recipes[0].id;
    const res = await request(app).get(`/api/recipes/${id}`);

    expect(res.headers["cache-control"]).toBe("public, max-age=600, stale-while-revalidate=1800");
  });

  it("does not require authentication", async () => {
    const res = await request(app).get("/api/recipes/1");

    expect(res.status).not.toBe(401);
    expect(res.status).not.toBe(403);
  });
});
