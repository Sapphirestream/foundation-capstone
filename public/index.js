const allBtns = document.querySelectorAll(".all");
const allSpellsBox = document.querySelector("#all-spells-holder");
const spellBookBox = document.querySelector("#spell-book-holder");
const allConcBtn = document.querySelector(".all-conc");
const allRituBtn = document.querySelector(".all-ritu");
const allAllBtn = document.querySelector(".all-all");
const bookBtns = document.querySelectorAll(".book");
const bookAllBtn = document.querySelector(".book-all");

WIZ_SCHOOL = "Necromancy";

concFlag = false;
rituFlag = false;
allFlag = false;

console.log("connected to index.js");

for (let i = 0; i < allBtns.length; i++) {
  allBtns[i].addEventListener("click", pullAllSpells);
}

allConcBtn.addEventListener("click", pullAllSpells);
allRituBtn.addEventListener("click", pullAllSpells);
allAllBtn.addEventListener("click", pullAllSpells);

for (let i = 0; i < bookBtns.length; i++) {
  bookBtns[i].addEventListener("click", pullBookSpells);
}

//bookAllBtn.addEventListener("click", pullBookSpells);

//ALL SPELLS btns minus the "all" btns
function pullAllSpells(e) {
  //console.log(e);
  const book = false;

  //toggle clicked button for ALL SPELLS
  if (e.target.classList.contains("all")) {
    e.target.classList.toggle("selected-all-btn");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL RITUAL is selected
  if (e.target.classList.contains("all-ritu")) {
    e.target.classList.toggle("selected-rc");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL CONC is selected
  if (e.target.classList.contains("all-conc")) {
    e.target.classList.toggle("selected-rc");
    allAllBtn.classList.remove("selected-all");
  }

  //if ALL ALL btn is selected
  if (e.target.classList.contains("all-all")) {
    e.target.classList.toggle("selected-all");
    allRituBtn.classList.remove("selected-rc");
    allConcBtn.classList.remove("selected-rc");

    for (let i = 0; i < allBtns.length; i++) {
      allBtns[i].classList.remove("selected-all-btn");
    }
  }

  //collect all selected buttons from same category
  const selected = document.querySelectorAll(".selected-all-btn");
  const selectText = [];

  //check if ritu or conc are selected
  concFlag = allConcBtn.classList.contains("selected-rc");
  rituFlag = allRituBtn.classList.contains("selected-rc");
  allFlag = allAllBtn.classList.contains("selected-all");

  //turn selected buttons into a string array
  selected.forEach((btn, i) => {
    selectText[i] = btn.innerText;
  });

  //find query from selected buttons
  const query = findPath(selectText);
  console.log(query);
  allSpellsBox.innerHTML = "";

  if (
    query != "" ||
    concFlag === true ||
    rituFlag === true ||
    allFlag === true
  ) {
    axios
      .post(`/api/spells/`, { query, concFlag, rituFlag })
      .then((res) => {
        console.log(res.data);

        for (let b = 0; b <= 9; b++) {
          createLvlLabels(selectText, book, b);
          for (let i = 0; i < res.data.length; i++) {
            createSpell(res.data[i], book, b);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

function pullBookSpells(e) {
  const book = true;

  if (e.target.classList.contains("book")) {
    //if the button is the All Button
    if (e.target.classList.contains("book-all")) {
      if (e.target.classList.contains("selected-book-btn")) {
        //if the all button is being UNSELECTED
        e.target.classList.remove("selected-book-btn");
      } else {
        //if the all button is being SELECTED
        const select = document.querySelectorAll(".selected-book-btn");
        select.forEach((elem) => {
          elem.classList.remove("selected-book-btn");
        });

        e.target.classList.add("selected-book-btn");
      }
    } else {
      //every other button selection
      e.target.classList.toggle("selected-book-btn");
      bookAllBtn.classList.remove("selected-book-btn");
    }
  }

  //collect all selected btns for books
  const selected = document.querySelectorAll(".selected-book-btn");
  const selectText = [];

  //turn selected btns into a string array
  selected.forEach((btn, i) => {
    selectText[i] = btn.innerText;
  });

  //create query for spellbook
  let query = findPath(selectText);

  //adding extra to the query
  query += bookQuery(selectText, "CON", "conc");
  query += bookQuery(selectText, "-R-", "ritu");
  query += bookQuery(selectText, "ALL", "all");

  if (query.startsWith("&")) {
    query = query.replace("&", "?");
  }

  console.log(query);

  axios
    .get(`/api/book/${query}`)
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

// give string array of button text and returns the query path
function findPath(selected) {
  let path = "";

  for (let i = 0; i < selected.length; i++) {
    switch (selected[i]) {
      case "-0-":
        path += "&level=0";
        break;
      case "1ST":
        path += "&level=1";
        break;
      case "2ND":
        path += "&level=2";
        break;
      case "3RD":
        path += "&level=3";
        break;
      case "4TH":
        path += "&level=4";
        break;
      case "5TH":
        path += "&level=5";
        break;
      case "6TH":
        path += "&level=6";
        break;
      case "7TH":
        path += "&level=7";
        break;
      case "8TH":
        path += "&level=8";
        break;
      case "9TH":
        path += "&level=9";
        break;
      case "ABJ":
        path += "&school=abjuration";
        break;
      case "CONJ":
        path += "&school=conjuration";
        break;
      case "DIV":
        path += "&school=divination";
        break;
      case "ENCH":
        path += "&school=enchantment";
        break;
      case "EVO":
        path += "&school=evocation";
        break;
      case "ILLU":
        path += "&school=illusion";
        break;
      case "NECRO":
        path += "&school=necromancy";
        break;
      case "TRANS":
        path += "&school=transmutation";
        break;
    }
  }

  path = path.replace("&", "?");

  return path;
}

function createSpell(spell, book, lvl) {
  if (spell.level != lvl) {
    return;
  }

  //creates the overall holder for the spell
  const spellHolder = document.createElement("section");
  spellHolder.classList.add("spell-hold");

  if (book) {
    spellBookBox.appendChild(spellHolder);
  } else {
    allSpellsBox.appendChild(spellHolder);
  }

  //creates the holder for the spell quick details
  const spellSumm = document.createElement("div");
  spellSumm.classList.add("spell-min");
  spellHolder.appendChild(spellSumm);

  //icon for the school of spell
  const spellIcon = document.createElement("img");
  spellIcon.classList.add("spell-icon");
  spellIcon.classList.add(spell.school.name);
  spellSumm.appendChild(spellIcon);

  //name of spell
  const nameHold = document.createElement("div");
  spellSumm.appendChild(nameHold);

  const spellName = document.createElement("h4");
  spellName.textContent = spell.name;
  nameHold.appendChild(spellName);

  //spell school
  const spellSchool = document.createElement("p");
  spellSchool.classList.add("grey");
  spellSchool.textContent = spell.school.name;
  nameHold.appendChild(spellSchool);

  //concentration & ritual
  const conc_ritu = document.createElement("p");
  conc_ritu.classList.add("w50");
  spellSumm.appendChild(conc_ritu);

  if (spell.concentration == true) {
    conc_ritu.textContent = "Conc";
    conc_ritu.classList.add("green");
  }

  if (spell.ritual == true) {
    conc_ritu.textContent = "Ritual";
    conc_ritu.classList.add("red");
  }

  //range
  const range = document.createElement("p");
  range.classList.add("w50");
  range.textContent = spell.range;
  spellSumm.appendChild(range);

  //damage + cost
  const damageHold = document.createElement("div");
  damageHold.classList.add("w50");
  spellSumm.appendChild(damageHold);

  //damage
  const damage = document.createElement("p");
  damageHold.appendChild(damage);

  if (spell.damage) {
    if (spell.damage.damage_at_character_level) {
      damage.textContent = spell.damage.damage_at_character_level[5];
    }
    if (spell.damage.damage_at_slot_level) {
      damage.textContent = spell.damage.damage_at_slot_level[spell.level];
    }
  } else {
    damage.textContent = "-";
  }

  //cost
  const cost = document.createElement("p");
  cost.classList.add("grey");
  damageHold.appendChild(cost);
  let gold = spell.level * 50;

  if (spell.school.name == WIZ_SCHOOL) {
    gold = gold / 2;
  }

  if (gold > 0) {
    cost.textContent = `${gold}g`;
  }

  //save
  const saveHold = document.createElement("div");
  saveHold.classList.add("w120");
  spellSumm.appendChild(saveHold);

  const spellSave = document.createElement("p");
  saveHold.appendChild(spellSave);

  if (spell.dc) {
    spellSave.textContent = `${spell.dc.dc_type.name} SAVE`;
  } else {
    spellSave.textContent = "-";
  }

  //time
  const spellTime = document.createElement("p");
  spellTime.classList.add("grey");
  saveHold.appendChild(spellTime);

  let time = spell.level * 2;
  if (spell.school.name == WIZ_SCHOOL) {
    time = time / 2;
  }

  if (time > 0) {
    spellTime.textContent = `${time} hours`;
  }

  //PLUS BUTTON
  const plus = document.createElement("p");
  plus.classList.add("plus");
  plus.textContent = "+";
  spellSumm.appendChild(plus);
  plus.addEventListener("click", expandSpell);
  plus.classList.add(`${spell.index}`);

  // EXTENDED SPELL DISPLAY
  const extendedSpell = document.createElement("div");
  extendedSpell.classList.add("spell-expand");
  //extendedSpell.classList.add("hidden")
  spellHolder.appendChild(extendedSpell);
  plus.classList.add(`${spell.index}`);

  spell.desc.forEach((elem) => {
    const descPara = document.createElement("p");
    extendedSpell.appendChild(descPara);
    descPara.classList.add("desc");
    descPara.classList.add("hidden");
    descPara.textContent = elem;
    descPara.classList.add(`${spell.index}`);
  });

  if (spell.higher_level) {
    const upCast = document.createElement("p");
    extendedSpell.appendChild(upCast);
    upCast.classList.add("desc");
    upCast.classList.add("hidden");
    upCast.classList.add(`${spell.index}`);
    upCast.textContent = spell.higher_level;
  }

  const btnHolder = document.createElement("div");
  extendedSpell.appendChild(btnHolder);
  btnHolder.classList.add("flex");
  btnHolder.classList.add("right");

  const spellBtn = document.createElement("button");
  btnHolder.appendChild(spellBtn);
  spellBtn.classList.add("remove-btn");
  spellBtn.classList.add("hidden");
  spellBtn.classList.add(`${spell.index}`);

  if (book) {
    spellBtn.textContent = "Remove from Spellbook";
    spellBtn.addEventListener("click", removeSpell);
  } else {
    spellBtn.textContent = "Add to Spellbook";
    spellBtn.addEventListener("click", addSpelltoBook);
  }

  if (book) {
    cost.classList.add("hidden");
    spellTime.classList.add("hidden");
  }
}

function createLvlLabels(selectText, book, b) {
  const label = document.createElement("h3");
  //console.log(selectText);
  let numFlag = false;

  if (book) {
    spellBookBox.appendChild(label);
  } else {
    allSpellsBox.appendChild(label);
  }

  if (selectText.includes("-0-")) {
    numFlag = true;
  } else if (selectText.includes("1ST")) {
    numFlag = true;
  } else if (selectText.includes("2ND")) {
    numFlag = true;
  } else if (selectText.includes("3RD")) {
    numFlag = true;
  } else if (selectText.includes("4TH")) {
    numFlag = true;
  } else if (selectText.includes("5TH")) {
    numFlag = true;
  } else if (selectText.includes("6TH")) {
    numFlag = true;
  } else if (selectText.includes("7TH")) {
    numFlag = true;
  } else if (selectText.includes("8TH")) {
    numFlag = true;
  } else if (selectText.includes("9TH")) {
    numFlag = true;
  }

  //console.log(`numFlag = ${numFlag}`);

  if (numFlag) {
    switch (b) {
      case 0:
        if (selectText.includes("-0-")) {
          label.textContent = "Cantrips";
        }
        break;
      case 1:
        if (selectText.includes("1ST")) {
          label.textContent = "1st Levels";
        }
        break;
      case 2:
        if (selectText.includes("2ND")) {
          label.textContent = "2nd Levels";
        }
        break;
      case 3:
        if (selectText.includes("3RD")) {
          label.textContent = "3rd Levels";
        }
        break;
      case 4:
        if (selectText.includes("4TH")) {
          label.textContent = "4th Levels";
        }
        break;
      case 5:
        if (selectText.includes("5TH")) {
          label.textContent = "5th Levels";
        }
        break;
      case 6:
        if (selectText.includes("6TH")) {
          label.textContent = "6th Levels";
        }
        break;
      case 7:
        if (selectText.includes("7TH")) {
          label.textContent = "7th Levels";
        }
        break;
      case 8:
        if (selectText.includes("8TH")) {
          label.textContent = "8th Levels";
        }
        break;
      case 9:
        if (selectText.includes("9TH")) {
          label.textContent = "9th Levels";
        }
        break;
    }
  } else {
    switch (b) {
      case 0:
        label.textContent = "Cantrips";
        break;
      case 1:
        label.textContent = "1st Levels";
        break;
      case 2:
        label.textContent = "2nd Levels";
        break;
      case 3:
        label.textContent = "3rd Levels";
        break;
      case 4:
        label.textContent = "4th Levels";
        break;
      case 5:
        label.textContent = "5th Levels";
        break;
      case 6:
        label.textContent = "6th Levels";
        break;
      case 7:
        label.textContent = "7th Levels";
        break;
      case 8:
        label.textContent = "8th Levels";
        break;
      case 9:
        label.textContent = "9th Levels";
        break;
    }
  }
}

function expandSpell(e) {
  const spellName = e.target.classList[1];
  const expand = document.querySelectorAll(`.${spellName}`);

  expand.forEach((elem) => {
    elem.classList.toggle("hidden");
  });

  if (e.target.textContent == "+") {
    e.target.textContent = "-";
  } else {
    e.target.textContent = "+";
  }

  e.target.classList.remove("hidden");
}

function removeSpell(e) {
  console.log("remove spell function");
}

//add spell to spell book from all spells
function addSpelltoBook(e) {
  const spell = e.target.classList[1];
  //console.log(`/api/spells/${spell}`);
  axios
    .post(`/api/spells/${spell}`)
    .then(() => {
      console.log(`${spell} added!`);
      e.target.parentNode.parentNode.parentNode.remove();
    })
    .catch((err) => {
      console.log(`${spell} error`, err);
    });
}

function bookQuery(btnText, test, flag) {
  let query = "";

  if (
    btnText.some((btn) => {
      return btn == test;
    })
  ) {
    query += `&${flag}=true`;
  } else {
    query += `&${flag}=false`;
  }

  return query;
}
