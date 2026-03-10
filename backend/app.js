import express from "express";
import morgan from "morgan";
import cors from "cors";
import db from "./models/index.js";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";

const isDev = (process.env.NODE_ENV || "production") === "development";
const serverError = { status: 500, message: "Server error" };

const app = express();

app.use(morgan(isDev ? "dev" : "tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    // Handle Sequelize database errors
    if (err.name === "SequelizeDatabaseError") {
        // Check if the error is about missing relation (table)
        if (err.original && err.original.message && err.original.message.includes("does not exist")) {
            return res.status(503).json(
                isDev
                    ? {
                          message: "Database is not initialized",
                          error: "Database tables do not exist. Please run migrations first.",
                          hint: "Run: pnpm exec sequelize-cli db:migrate",
                          details: err.original.message,
                      }
                    : serverError,
            );
        }
    }

    // Handle Sequelize connection errors
    if (err.name === "SequelizeConnectionError" || err.name === "SequelizeConnectionRefusedError") {
        return res.status(503).json(
            isDev
                ? {
                      message: "Database connection failed",
                      error: "Unable to connect to the database. Please check your database configuration.",
                      hint: "Make sure your database is running and credentials are correct.",
                  }
                : serverError,
        );
    }

    // Handle other Sequelize errors
    if (err.name && err.name.startsWith("Sequelize")) {
        return res.status(500).json(
            isDev
                ? {
                      message: "Database error",
                      error: err.message,
                  }
                : serverError,
        );
    }

    // Handle standard HTTP errors
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});

const PORT = process.env.APP_PORT || 3000;

db.sequelize
    .authenticate()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Database connection successful.`);
            console.log(`Server is running. Use our API on port: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Database connection error:", err);
        process.exit(1);
    });
