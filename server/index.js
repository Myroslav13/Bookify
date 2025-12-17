import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

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
    const response = await db.query("SELECT password FROM users WHERE email = $1", [username]);
    const data = response.rows[0].password;
    res.send(data);
});

app.listen(port, () => {
    console.log(`Successfully listening to port ${port}`);
});