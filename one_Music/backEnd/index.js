require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const expressSession = require("express-session");
const { initializeGoogleStrategy } = require("./helper/passportAuth");
const cors = require("cors");
// const fs = require("fs");
// const path = require("path");

// const filePath = "./localData/userData.json";
// const userData = require("./localData/userLocalData");
// const userLocalData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database Connection established SuccessFully.......");
  })
  .catch((err) => {
    console.error(`Error connecting to MongoDB: ${err}`);
  });
app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use secure: false for local development
  })
);

// Middleware configuration
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

initializeGoogleStrategy(passport);

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

const userRoute = require("./routes/user.routes");
const musicRoute = require("./routes/music.routes");

// routes
const endPointPREFIXED = {
  user: "/api/user",
  music: "/api/music",
};
app.get("/", async (req, res) => {
  res.send("Welcome TEST to the OPEN MUSIC API ");
});

app.use(endPointPREFIXED.user, userRoute);
app.use(endPointPREFIXED.music, musicRoute);

// port number
app.listen(PORT, () => {
  console.log(`server Is running At http://localhost:${PORT}`);
});
