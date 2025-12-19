import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
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
  const email = req.query.email;
  const password = req.query.password;

  const response = await db.query("SELECT password FROM users WHERE email = $1", [email]);

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
  const email = req.body.email;
  const password = req.body.password;

  try {
    const response = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id", [email, password]);
    const newUserId = response.rows[0].id;

    if (newUserId != null) {
      res.send(newUserId);
    }
  } catch (error) {
    res.send(false);
  }

  res.send(false);
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});