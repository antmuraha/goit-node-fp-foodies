import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Jimp } from 'jimp';
import { saveAvatar } from '../services/avatarServices.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.join(__dirname, '../public/avatars');

describe('avatarServices.saveAvatar', () => {
  const userId = 987654;
  const avatarPath = path.join(AVATARS_DIR, `${userId}.png`);

  afterEach(async () => {
    await fs.unlink(avatarPath).catch(() => null);
  });

  it('saves a processed avatar and returns public url', async () => {
    const image = new Jimp({ width: 8, height: 8, color: 0xff00ffff });
    const buffer = await image.getBuffer('image/png');

    const result = await saveAvatar(userId, {
      buffer,
      originalname: 'avatar.jpg',
    });

    expect(result).toBe(`/avatars/${userId}.png`);

    const fileExists = await fs
      .access(avatarPath)
      .then(() => true)
      .catch(() => false);

    expect(fileExists).toBe(true);
  });
});
