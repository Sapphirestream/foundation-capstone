require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.resolve("./public")));

const { SERVER_PORT, CONNECTION_STRING } = process.env;

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const {
  getWizardSpells,
  addSpelltoBook,
  getBookSpells,
  deleteSpellfromBook,
  addHomebrew,
} = require("./controller.js");
const { home, styles, reset, js } = require("./loader.js");
const { seed } = require("./seed.js");

//CONNECT HTML
app.get("/", home);
app.get("/styles", styles);
app.get("/reset", reset);
app.get("/js", js);
app.get("/seed", seed);

//ALL SPELLS
app.post("/api/spells/", getWizardSpells);
app.post("/api/spells/:index", addSpelltoBook);

//SPELLBOOK
app.get("/api/book/", getBookSpells);
app.delete("/api/book/:index", deleteSpellfromBook);
app.post("/api/book/homebrew/", addHomebrew);

const port = process.env.PORT || SERVER_PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
