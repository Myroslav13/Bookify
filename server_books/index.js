import express from 'express';
import pg from 'pg';
import cors from 'cors';

const app = express();
const port = 3500;

app.use(cors());

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Udemy",
  password: "myroslav13",
  port: 5432,
});

db.connect();

app.get("/all", async (req, res) => {

});

app.get("/:id", async (req, res) => {

});

app.post("/add", async (req, res) => {

});

app.patch("/edit/:id", async (req, res) => {

});

app.delete("/delete/:id", async (req, res) => {

});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});