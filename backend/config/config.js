import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(path.dirname(__dirname), ".env") });

// Map environment variables to Sequelize config
const config = {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
    dialect: "postgres",
};

export default {
    development: {
        username: config.username,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    test: {
        username: config.username,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: {
            bigNumberStrings: true,
        },
    },
    production: {
        username: config.username,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        dialectOptions: {
            bigNumberStrings: true,
            ssl: process.env.POSTGRES_SSL === "true" ?{
                require: true,
                rejectUnauthorized: false,
            } : undefined,
        },
    },
};
