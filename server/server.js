require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

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

const { getWizardSpells, addSpelltoBook } = require("./controller.js");
const { home, styles, reset, js } = require("./loader.js");
const { seed } = require("./seed.js");

//CONNECT HTML
app.get("/", home);
app.get("/styles", styles);
app.get("/reset", reset);
app.get("/js", js);
app.get("/seed", seed);

//GET SPELLS including Queries
app.post("/api/spells/", getWizardSpells);
app.post("/api/spells/:index", addSpelltoBook);

const port = process.env.PORT || SERVER_PORT;

app.listen(port, () => console.log(`server running on port ${port}`));
