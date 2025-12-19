import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const port = 3500;

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

app.get("/all", async (req, res) => {
    const userId = req.query.id;
    const response = await db.query("SELECT id, name, author FROM books WHERE user_id = $1", [userId]);
    const data = response.rows;

    if (data) {
        res.status(400).json({ message: `There's no user with id = ${userId}` });
    }

    res.json(data);
});

app.get("/:id", async (req, res) => {
    const bookId = req.params.id;
    const response = await db.query("SELECT id, name, author FROM books WHERE id = $1", [bookId]);
    const data = response.rows[0];

    if (!data) {
        res.status(400).json({ message: `There's no book with id = ${bookId}` });
    }

    res.json(data);
});

app.post("/add", async (req, res) => {
    const bookName = req.query.name;
    const authorName = req.query.author;
    const userId = req.query.user_id;

    const response = await db.query("INSERT INTO books (name, author, user_id) VALUES ($1, $2, $3) RETURNING id", [bookName, authorName, userId]);
    const data = response.rows[0];

    res.json(data);
});

app.put("/edit/:id", async (req, res) => {
    const bookId = req.params.id;
    const bookName = req.body.name;
    const authorName = req.body.author;

    const response = await db.query("UPDATE books SET name = $1, author = $2 WHERE id = $3", [bookName, authorName, bookId]);
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