import express from 'express';
import pg from 'pg';
import cors from 'cors';
import env from 'dotenv';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  port: 5432,
});

db.connect();

app.get("/login", async (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  try {
    const response = await db.query("SELECT id, password FROM users WHERE email = $1", [email]);
    const userId = response.rows[0].id;

    if (response.rows.length === 0) {
      res.send(userId);
    }

    const storedPassword = response.rows[0].password;
    bcrypt.compare(password, storedPassword, (err, result) => {
      if (result) {
        res.send(userId);
      } else {
        res.send(false);
      }
    });
  } catch (error) {
    res.send(false);
  }
});

app.post("/register", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      const response = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", [email, hash]);
      const newUserId = response.rows[0].id;

      if (newUserId != null) {
        res.send(newUserId);
      } else {
        res.send(false);
      }
    });
  } catch (error) {
    res.send(false);
  }
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});