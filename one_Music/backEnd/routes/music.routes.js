const express = require("express");
const musicRoutes = express.Router();

const { search } = require("../controller/music.controller");

musicRoutes.get("/search", search);

module.exports = musicRoutes;
