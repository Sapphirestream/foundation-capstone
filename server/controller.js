require("dotenv").config();

const axios = require("axios");

let allWizardSpells = [];

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

      allWizardSpells = await fetchAllSpells(allSpellUrls, concFlag, rituFlag);
      res.status(200).send(allWizardSpells);
    });
  },
};

function fetchAllSpells(allSpellUrls, c, r) {
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
    });

    return spells;
  });
}
