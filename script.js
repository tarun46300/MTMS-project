// server.js
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve all files from public folder

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "mtms",
});

db.connect((err) => {
  if (err) {
    console.error("❌ DB Connection Failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Routes
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, password],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database insert error" });
      }
      res.json({ success: true, message: "Registration successful" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database query error" });
      }
      if (results.length > 0) {
        res.json({ success: true, message: "Login successful" });
      } else {
        res.status(401).json({ success: false, error: "Invalid credentials" });
      }
    }
  );
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
