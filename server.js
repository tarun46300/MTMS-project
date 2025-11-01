import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend files

// ✅ MySQL connection using .env or defaults
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "movie_theatre",
  port: process.env.DB_PORT || 3306,
});

// ✅ Connect to database
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Test route
app.get("/test", (req, res) => res.json({ message: "Server working fine!" }));

// ✅ Fetch all movies (example)
app.get("/movies", (req, res) => {
  const sql = "SELECT * FROM movie";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

// ✅ Registration Route
app.post("/register", async (req, res) => {
  const { name, phone_number, email, password } = req.body;

  if (!name || !phone_number || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exists
    const [existing] = await db.promise().query("SELECT * FROM user WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db
      .promise()
      .query(
        "INSERT INTO user (name, phone_number, email, password) VALUES (?, ?, ?, ?)",
        [name, phone_number, email, password]
      );

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error("❌ Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Login Route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide both email and password" });
  }

  try {
    const [rows] = await db.promise().query("SELECT * FROM user WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
