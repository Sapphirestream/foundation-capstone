require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const axios = require("axios");

const Sequelize = require("sequelize");

const sequelize = new Sequelize(CONNECTION_STRING, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

let allWizardSpells = [];
let spellIndex = [];

module.exports = {
  //GET WIZARD SPELLS
  getWizardSpells: (req, res) => {
    // console.log(req.body);
    const { query, concFlag, rituFlag } = req.body;

    let path = `http://www.dnd5eapi.co/api/spells/`;
    path += query;

    // console.log(path);

    axios.get(path).then(async (res1) => {
      let allSpellUrls = [];

      //cycle over each spell individually
      res1.data.results.forEach((e, i) => {
        const spellUrl = "http://www.dnd5eapi.co" + e.url;
        allSpellUrls.push(axios.get(spellUrl));
      });

      allWizardSpells = await fetchAllSpells(
        allSpellUrls,
        concFlag,
        rituFlag,
        spellIndex
      );
      res.status(200).send(allWizardSpells);
    });
  },

  //ADD Spells from ALL Spells to Spell book
  addSpelltoBook: (req, res) => {
    const { index } = req.params;

    axios.get(`http://www.dnd5eapi.co/api/spells/${index}`).then((res) => {
      // pull data to add to the table
      const { level, concentration, ritual } = res.data;
      const school = res.data.school.name;

      //console.log(index, level, concentration, ritual, school);

      sequelize.query(`SELECT index FROM spellbook`).then((res) => {
        //console.log(res[0]);
        spellIndex = res[0];
        const check = checkIndex(spellIndex, index);
        console.log(`${index}: ${check}`);

        if (check == true) {
          sequelize
            .query(
              `INSERT INTO spellbook(index, level, school, concentration, ritual, homebrew)
      VALUES ('${index}', ${level}, '${school}', ${concentration}, ${ritual}, false);`
            )
            .then(() => {
              console.log(`${index} added`);
            })
            .catch((err) => console.log(`error adding spell ${index}`, err));
        }
      });
    });

    res.sendStatus(200);
  },

  getBookSpells: (req, res) => {
    console.log("getBookSpells");
  },
};

function fetchAllSpells(allSpellUrls, c, r, spellIndex) {
  return Promise.all(allSpellUrls).then((response) => {
    spells = [];
    let conc;
    let ritu;

    // check if its a wizard spell
    response.forEach((e) => {
      const wizard = e.data.classes.findIndex((obj) => {
        return obj.index == "wizard";
      });

      if (c) {
        conc = e.data.concentration;
      }

      if (r) {
        ritu = e.data.ritual;
      }

      console.log(`spellIndex inside fetchAllSpells`);
      console.log(spellIndex);
      const check = checkIndex(spellIndex, e.data.index);

      if (check) {
        if (wizard != -1 || !wizard) {
          if (c && !r) {
            if (conc) {
              spells.push(e.data);
            }
          } else if (r && !c) {
            if (ritu) {
              spells.push(e.data);
            }
          } else if (r && c) {
            if (ritu || conc) {
              spells.push(e.data);
            }
          } else {
            spells.push(e.data);
          }
        }
      }
    });

    return spells;
  });
}

function checkIndex(indexList, index) {
  const check = !indexList.some((spell) => spell.index == index);
  return check;
}
