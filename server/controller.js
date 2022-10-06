require("dotenv").config();
const { CONNECTION_STRING } = process.env;

const axios = require("axios");
const e = require("express");

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

//initialize spellbook
sequelize
  .query(`SELECT index FROM spellbook`)
  .then((res) => {
    spellIndex = res[0];
  })
  .catch((err) => console.log(`error initializing spellbook`, err));

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
      res1.data.results.forEach((e) => {
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
        spellIndex = res[0];
        const check = checkIndex(spellIndex, index);
        console.log(`${index}: ${check}`);

        if (check == true) {
          sequelize
            .query(
              `INSERT INTO spellbook(index, level, school, concentration, ritual, homebrew)
      VALUES ('${index}', ${level}, '${school.toLowerCase()}', ${concentration}, ${ritual}, false);`
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

  //GET BOOK SPELLS
  getBookSpells: (req, res) => {
    const { level, school, conc, ritu, all } = req.query;
    let allBookSpells = [];
    let sqlWhere = "";

    if (all == "false") {
      sqlWhere = bookSqlWhere(level, school, conc, ritu);
    }

    console.log(sqlWhere);

    sequelize
      .query(
        `select index FROM spellbook
      WHERE homebrew IS false${sqlWhere};`
      )
      .then(async (dbRes) => {
        let allSpellUrls = [];

        dbRes[0].forEach((e) => {
          const spellUrl = "http://www.dnd5eapi.co/api/spells/" + e.index;
          //console.log(spellUrl);
          allSpellUrls.push(axios.get(spellUrl));
        });

        //retrieve all Canon spells from API
        allBookSpells = await fetchBookSpells(allSpellUrls);

        //retrieve HOMEBREW spells from DB
        await sequelize
          .query(
            `select * FROM spellbook
          JOIN homebrew
          ON spellbook.spellbook_id = homebrew.spellbook_id
          WHERE homebrew IS true${sqlWhere};`
          )
          .then((hbRes) => {
            //format spells to work with spellbuilder & add to allBookSpells
            hbRes[0].forEach((hb, i) => {
              allBookSpells.push(formatHomeBrew(hb));
            });
          })
          .catch((err) => console.log(err));

        //console.log(allBookSpells);
        res.status(200).send(allBookSpells);
      })
      .catch((err) => console.log(err));
  },

  deleteSpellfromBook: (req, res) => {
    const { index } = req.params;

    sequelize
      .query(
        `DELETE FROM spellbook
      WHERE index = '${index}';`
      )
      .then((dbRes) => {
        console.log(dbRes[0]);
      })
      .catch((err) => console.log(`error deleting ${index}`, err));

    sequelize
      .query(`SELECT index FROM spellbook`)
      .then((res) => {
        spellIndex = res[0];
      })
      .catch((err) => console.log(`error initializing spellbook`, err));

    res.sendStatus(200);
  },
};

function fetchBookSpells(allSpellUrls) {
  console.log(allSpellUrls);
  return Promise.all(allSpellUrls).then((response) => {
    spells = [];

    response.forEach((e) => {
      spells.push(e.data);
    });
    return spells;
  });
}

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

      //console.log(spellIndex);
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

//build the WHERE command in SQL
function bookSqlWhere(level, school, conc, ritu) {
  let sqlWhere = "";

  //check level flags
  if (level) {
    sqlWhere = bookSqlWhereFlag(sqlWhere, "level", level);
  }

  //check school flags
  if (school) {
    sqlWhere = bookSqlWhereFlag(sqlWhere, "school", school);
  }

  //checking conc and ritu flags
  if (conc == "true" && ritu == "true") {
    sqlWhere += ` AND (concentration IS true OR ritual IS true)`;
  } else {
    if (conc == "true") {
      sqlWhere += ` AND concentration IS true`;
    }

    if (ritu == "true") {
      sqlWhere += ` AND ritual IS true`;
    }
  }

  return sqlWhere;
}

//indiv build for SQL WHERE call for arrayed items
function bookSqlWhereFlag(sql, check, array) {
  if (typeof array == "object" || check == "level") {
    sql += ` AND ${check} IN (`;
    for (let i = 0; i < array.length; i++) {
      if (check == "level") {
        sql += `${array[i]}`;
      } else {
        sql += `'${array[i]}'`;
      }
      if (i != array.length - 1) {
        sql += ", ";
      } else {
        sql += ")";
      }
    }
  } else {
    sql += ` AND ${check} IN ('${array}')`;
  }
  return sql;
}

//put called hb into correct object format
function formatHomeBrew(hb) {
  const {
    level,
    school,
    name,
    concentration,
    ritual,
    range,
    damage,
    dc,
    index,
    description,
    higher_level,
    homebrew,
  } = hb;

  //split desc along new lines
  let desc = description.split(/\r?\n/);

  //capitalize the school name to match Class
  const school_name = school.charAt(0).toUpperCase() + school.slice(1);

  const newFormat = {
    level: level,
    school: { name: school_name },
    name: name,
    concentration: concentration,
    ritual: ritual,
    range: range,
    damage: damage,
    dc: { dc_type: { name: dc } },
    index: index,
    desc: desc,
    higher_level: higher_level,
    homebrew: homebrew,
  };

  return newFormat;
}
