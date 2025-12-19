import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Udemy",
  password: "myroslav13",
  port: 5432,
});

db.connect();

app.get("/login", async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const response = await db.query("SELECT password FROM users WHERE email = $1", [username]);

  if (response.rows.length === 0) {
    res.send(false);
  }

  const storedPassword = response.rows[0].password;
  if (storedPassword == password) {
    res.send(true);
  } else {
    res.send(false);
  }
});

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const response = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", [username, password]);
  const newUserId = response.rows[0].id;

  if (newUserId != null) {
    res.send(newUserId);
  }

  res.send(false);
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});