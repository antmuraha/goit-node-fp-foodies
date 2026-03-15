import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Jimp } from 'jimp';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import request from 'supertest';
import { app, db } from '../app.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.join(__dirname, '../public/avatars');

let TEST_PNG_BUFFER;

beforeAll(async () => {
  const testImage = new Jimp({ width: 4, height: 4, color: 0xffffffff });
  TEST_PNG_BUFFER = await testImage.getBuffer('image/png');
});

const createAuthToken = async (user) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  });

  await user.update({ token });

  return token;
};

const createAuthHeader = (token) => {
  return `Bearer ${token}`;
};

const createAuthCookie = (token) => {
  return `token=${token}; HttpOnly`;
};

describe('POST /api/users/:id/follow', () => {
  let follower;
  let following;
  let authHeader;

  beforeEach(async () => {
    const password = await bcrypt.hash('password123', 10);
    follower = await db.User.create({
      name: `Follower ${Date.now()}`,
      email: `follower-${Date.now()}@example.com`,
      password,
      verify: true,
    });
    following = await db.User.create({
      name: `Following ${Date.now()}`,
      email: `following-${Date.now()}@example.com`,
      password,
      verify: true,
    });
    const token = await createAuthToken(follower);
    authHeader = createAuthHeader(token);
  });

  afterEach(async () => {
    await db.Follow.destroy({ where: {} });
    await db.User.destroy({
      where: {
        id: [follower?.id, following?.id].filter(Boolean),
      },
      force: true,
    });
  });

  it('creates a follow record and returns 201', async () => {
    const res = await request(app)
      .post(`/api/users/${following.id}/follow`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: 'Followed successfully' });

    const follow = await db.Follow.findOne({
      where: { followerId: follower.id, followingId: following.id },
    });

    expect(follow).not.toBeNull();
  });

  it('returns 400 when user tries to follow themselves', async () => {
    const res = await request(app)
      .post(`/api/users/${follower.id}/follow`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Cannot follow yourself' });
  });

  it('returns 409 for duplicate follow', async () => {
    await db.Follow.create({
      followerId: follower.id,
      followingId: following.id,
    });

    const res = await request(app)
      .post(`/api/users/${following.id}/follow`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: 'Already following this user' });
  });

  it('returns 404 for a non-existent target user', async () => {
    const res = await request(app)
      .post('/api/users/999999/follow')
      .set('Authorization', authHeader);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User not found' });
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).post(`/api/users/${following.id}/follow`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Not authorized' });
  });
});

describe('DELETE /api/users/:id/follow', () => {
  let follower;
  let following;
  let authHeader;

  beforeEach(async () => {
    const password = await bcrypt.hash('password123', 10);
    follower = await db.User.create({
      name: `Follower Delete ${Date.now()}`,
      email: `follower-delete-${Date.now()}@example.com`,
      password,
      verify: true,
    });
    following = await db.User.create({
      name: `Following Delete ${Date.now()}`,
      email: `following-delete-${Date.now()}@example.com`,
      password,
      verify: true,
    });
    const token = await createAuthToken(follower);
    authHeader = createAuthHeader(token);
  });

  afterEach(async () => {
    await db.Follow.destroy({ where: {} });
    await db.User.destroy({
      where: {
        id: [follower?.id, following?.id].filter(Boolean),
      },
      force: true,
    });
  });

  it('deletes a follow record and returns 200', async () => {
    await db.Follow.create({
      followerId: follower.id,
      followingId: following.id,
    });

    const res = await request(app)
      .delete(`/api/users/${following.id}/follow`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Unfollowed successfully' });

    const follow = await db.Follow.findOne({
      where: { followerId: follower.id, followingId: following.id },
    });

    expect(follow).toBeNull();
  });

  it('returns 404 when follow record does not exist', async () => {
    const res = await request(app)
      .delete(`/api/users/${following.id}/follow`)
      .set('Authorization', authHeader);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Not following this user' });
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).delete(`/api/users/${following.id}/follow`);

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Not authorized' });
  });
});

describe('PATCH /api/users/avatar', () => {
  let user;
  let authHeader;
  let authCookie;

  beforeEach(async () => {
    const password = await bcrypt.hash('password123', 10);
    user = await db.User.create({
      name: `Avatar User ${Date.now()}`,
      email: `avatar-user-${Date.now()}@example.com`,
      password,
      verify: true,
    });
    const token = await createAuthToken(user);
    authHeader = createAuthHeader(token);
    authCookie = createAuthCookie(token);
  });

  afterEach(async () => {
    if (user?.id) {
      await fs
        .unlink(path.join(AVATARS_DIR, `${user.id}.png`))
        .catch(() => null);
    }

    await db.User.destroy({
      where: {
        id: [user?.id].filter(Boolean),
      },
      force: true,
    });
  });

  it('uploads avatar via multipart/form-data and returns 200', async () => {
    const res = await request(app)
      .patch('/api/users/avatar')
      .set('Authorization', authHeader)
      .attach('avatar', TEST_PNG_BUFFER, 'avatar.png');

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('avatarURL');
    expect(res.body.user.avatarURL).toBe(`/avatars/${user.id}.png`);

    const avatarFileExists = await fs
      .access(path.join(AVATARS_DIR, `${user.id}.png`))
      .then(() => true)
      .catch(() => false);

    expect(avatarFileExists).toBe(true);
  });

  it('prioritizes file upload when both file and avatarURL are provided', async () => {
    const res = await request(app)
      .patch('/api/users/avatar')
      .set('Authorization', authHeader)
      .field('avatarURL', 'https://example.com/should-not-be-used.png')
      .attach('avatar', TEST_PNG_BUFFER, 'avatar.png');

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty(
      'avatarURL',
      `/avatars/${user.id}.png`,
    );
  });

  it('updates avatarURL via JSON and returns 200', async () => {
    const avatarURL = 'https://example.com/avatar.png';

    const res = await request(app)
      .patch('/api/users/avatar')
      .set('Authorization', authHeader)
      .send({ avatarURL });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('avatarURL', avatarURL);
  });

  it('returns 401 without authentication', async () => {
    const res = await request(app).patch('/api/users/avatar').send({
      avatarURL: 'https://example.com/avatar.png',
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Not authorized' });
  });

  it('accepts authentication via token cookie', async () => {
    const avatarURL = 'https://example.com/avatar-cookie.png';

    const res = await request(app)
      .patch('/api/users/avatar')
      .set('Cookie', authCookie)
      .send({ avatarURL });

    expect(res.status).toBe(200);
    expect(res.body.user).toHaveProperty('avatarURL', avatarURL);
  });

  it('returns 400 for invalid avatarURL', async () => {
    const res = await request(app)
      .patch('/api/users/avatar')
      .set('Authorization', authHeader)
      .send({ avatarURL: 'not-a-url' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Avatar must be a valid URL' });
  });
});

afterAll(async () => {
  await db.sequelize.close();
});
