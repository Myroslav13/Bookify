import express from 'express';
import pg from 'pg';
import cors from 'cors';
import env from 'dotenv';
import bcrypt from 'bcrypt';
import passport from 'passport';
import session from "express-session";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.PASSWORD,
  port: 5432,
});

db.connect();

app.get("/auth/google", passport.authenticate("google", {scope: ["profile", "email"]}));

app.get("/auth/google/bookify", passport.authenticate("google", {
  failureRedirect: "http://localhost:3000/login",
  successRedirect: "http://localhost:3000/login",
}));

passport.use("google", new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/bookify",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {  
      const response = await db.query("SELECT * FROM users WHERE email = $1", [profile.email]);

      if (response.rows.length > 0) {
        return cb(null, profile);
      } else {
        const response = await db.query("INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email", [profile.email, "google"]);
        return cb(null, response.rows[0]);
      }
    } catch (err) {
      return cb(err);
    }
  }
));

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

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});