import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { saveAvatar } from "../services/avatarServices.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const AVATARS_DIR = path.join(__dirname, "../public/avatars");

describe("avatarServices.saveAvatar", () => {
  const userId = 987654;
  const avatarPath = path.join(AVATARS_DIR, `${userId}.jpg`);
  const TEST_PNG_BUFFER = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    "base64",
  );

  afterEach(async () => {
    await fs.unlink(avatarPath).catch(() => null);
  });

  it("saves an uploaded avatar and returns public url", async () => {
    const result = await saveAvatar(userId, {
      buffer: TEST_PNG_BUFFER,
      originalname: "avatar.jpg",
      mimetype: "image/jpeg",
    });

    expect(result).toBe(`/avatars/${userId}.jpg`);

    const fileExists = await fs
      .access(avatarPath)
      .then(() => true)
      .catch(() => false);

    expect(fileExists).toBe(true);
  });
});
