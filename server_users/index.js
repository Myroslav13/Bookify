import express from "express";
import pg from "pg";
import cors from "cors";
import env from "dotenv";
import bcrypt from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";

const app = express();
const port = 3000;
const saltRounds = 10;

env.config();
app.use(
   cors({
      origin: "http://localhost:5173",
      credentials: true,
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
   session({
      secret: process.env.COOKIE_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: {
         maxAge: 1000 * 60 * 60 * 24,
      },
   })
);

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

passport.use(
   "local",
   new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (username, password, cb) => {
         try {
            const response = await db.query(
               "SELECT * FROM users WHERE email = $1",
               [username]
            );
            const user = response.rows[0];

            if (response.rows.length === 0) {
               return cb(null, false);
            }

            const storedPassword = response.rows[0].password;
            bcrypt.compare(password, storedPassword, (err, result) => {
               if (err) {
                  return cb(err);
               } else {
                  if (result) {
                     return cb(null, user);
                  } else {
                     return cb(null, false);
                  }
               }
            });
         } catch (err) {
            return cb(err);
         }
      }
   )
);

passport.use(
   "google",
   new GoogleStrategy(
      {
         clientID: process.env.GOOGLE_CLIENT_ID,
         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
         callbackURL: "http://localhost:3000/auth/google/callback",
         userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async function (request, accessToken, refreshToken, profile, done) {
         const response = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [profile.email]
         );
         const user = response.rows[0];

         if (response.rows.length !== 0) {
            return done(null, user);
         } else {
            const response = await db.query(
               "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *",
               [profile.email, "google"]
            );
            const user = response.rows[0];

            if (user) {
               return done(null, user);
            }
            return done(null, false);
         }
      }
   )
);

app.get(
   "/auth/google",
   passport.authenticate("google", {
      scope: ["profile", "email"],
   })
);

app.get(
   "/auth/google/callback",
   passport.authenticate("google", {
      failureRedirect: "http://localhost:5173/login",
      successRedirect: "http://localhost:5173/main",
   })
);

app.post("/login", (req, res) => {
   passport.authenticate("local", (error, user) => {
      if (error) {
         return res.status(400).json({ message: "Something went wrong" });
      } 
      
      if (!user) {
         return res.status(401).json({ message: "Invalid email or password" });
      }
   
      req.login(user, (err) => {
         if (err) throw err;

         return res.status(200).json({
            message: "Successfully logged in",
            user: { id: user.id, email: user.email },
         });
      });
   })(req, res);
});

app.post("/register", async (req, res) => {
   const email = req.body.email;
   const password = req.body.password;

   try {
      const checkUser = await db.query("SELECT id FROM users WHERE email = $1", [email]);
      
      if (checkUser.rows.length > 0) {
         return res.status(400).json({ error: "Email already exists" });
      }

      bcrypt.hash(password, saltRounds, async (err, hash) => {
         if (err) {
            return res.status(400).json({ error: "Registration failed" });
         }

         const response = await db.query(
            "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email",
            [email, hash]
         );
         const user = response.rows[0];

         if (user) {
            return res.status(200).json({ user: { id: user.id, email: user.email } });
         } else {
            return res.status(400).json({ error: "Registration failed" });
         }
      });
   } catch (error) {
      return res.status(400).send(false);
   }
});

app.get("/me", (req, res) => {
   if (req.isAuthenticated()) {
      return res.status(200).json(req.user);
   }
   return res.status(401).json({ message: "You are not authenticated" });
});

passport.serializeUser((user, cb) => {
   cb(null, user.id);
});

passport.deserializeUser(async (userId, cb) => {
   const response = await db.query(
      "SELECT id, email, password FROM users WHERE id = $1",
      [userId]
   );
   const user = response.rows[0];
   cb(null, user);
});

app.listen(port, () => {
   console.log(`Successfully listening to port ${port}`);
});
