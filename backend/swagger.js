import swaggerUi from "swagger-ui-express";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import yaml from "js-yaml";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const spec = yaml.load(readFileSync(join(__dirname, "docs", "openapi.yaml"), "utf8"));

export { swaggerUi, spec };
