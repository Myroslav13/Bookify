import express from 'express';
import pg from 'pg';
import cors from 'cors';
import env from 'dotenv';

const app = express();
const port = 3500;

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

app.get("/getAll", async (req, res) => {
    const userId = req.query.id;
    const response = await db.query("SELECT id, name, author, reaction, rate, date_read FROM books WHERE user_id = $1", [userId]);
    const data = response.rows;

    if (data.length === 0) {
        res.status(400).json({ message: `There's no user or books of user with id = ${userId}` });
    }

    res.status(200).json(data);
});

app.get("/get/:id", async (req, res) => {
    const bookId = req.params.id;
    const response = await db.query("SELECT id, name, author, reaction, rate, date_read FROM books WHERE id = $1", [bookId]);
    const data = response.rows[0];

    if (!data) {
        res.status(400).json({ message: `There's no book with id = ${bookId}` });
    }

    res.status(200).json(data);
});

app.post("/add", async (req, res) => {
    const bookName = req.body.name;
    const authorName = req.body.author;
    const userId = req.body.user_id;
    const reaction = req.body.reaction;
    const rate = req.body.rate;
    const date_read = req.body.date_read;

    const response = await db.query("INSERT INTO books (name, author, user_id, reaction, rate, date_read) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id", [bookName, authorName, userId, reaction, rate, date_read]);
    const data = response.rows[0];

    res.json(data);
});

app.put("/edit/:id", async (req, res) => {
    const bookId = req.params.id;
    const bookName = req.body.name;
    const authorName = req.body.author;
    const reaction = req.body.reaction;
    const rate = req.body.rate;
    const date_read = req.body.date_read;

    const response = await db.query("UPDATE books SET name = $1, author = $2, reaction = $4, rate = $5, date_read = $6 WHERE id = $3", [bookName, authorName, bookId, reaction, rate, date_read]);
    const rowCount = response.rowCount;

    if (rowCount == 1) {
        res.status(200).json({ message: "Book was successfully edited" });
    } 
    
    res.status(400).json({ message: `There's no book with id = ${bookId}` });
});

app.delete("/delete/:id", async (req, res) => {
    const bookId = req.params.id;
    const response = await db.query("DELETE FROM books WHERE id = $1", [bookId]);
    const rowCount = response.rowCount;

    if (rowCount == 1) {
        res.status(200).json({ message: "Book was successfully deleted" });
    } 
    
    res.status(400).json({ message: `There's no book with id = ${bookId}` });
});

app.listen(port, () => {
    console.log(`Successfully listening to port ${port}`);
});