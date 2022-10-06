const allBtns = document.querySelectorAll(".all");
const allSpellsBox = document.querySelector("#all-spells-holder");
const spellBookBox = document.querySelector("#spell-book-holder");
const allConcBtn = document.querySelector(".all-conc");
const allRituBtn = document.querySelector(".all-ritu");
const allAllBtn = document.querySelector(".all-all");
const bookBtns = document.querySelectorAll(".book");
const bookAllBtn = document.querySelector(".book-all");
const addHbBtn = document.querySelector("#add-hb");
const hbBox = document.querySelector("#hb-hold");
const submitHbBtn = document.querySelector("#submit-hb");
const clearHbBtn = document.querySelector("#clear-hb");
const hbNotif = document.querySelector("#hb-notif");
const hbDamage = document.getElementById("dmg");

WIZ_SCHOOL = "Necromancy";
WIZ_LEVEL = 5;

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

addHbBtn.addEventListener("click", showHomebrew);
submitHbBtn.addEventListener("click", submitHomebrew);
clearHbBtn.addEventListener("click", clearHb);
hbDamage.addEventListener("click", toggleDmg);

//get ALL SPELLS
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

        cleanNodes(allSpellsBox);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

//get BOOK SPELLS
function pullBookSpells(e) {
  const book = true;
  spellBookBox.innerHTML = "";

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

  //exit the function if nothing is selected
  if (selectText.length == 0) return;

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

      for (let b = 0; b <= 9; b++) {
        createLvlLabels(selectText, book, b);
        for (let i = 0; i < res.data.length; i++) {
          createSpell(res.data[i], book, b);
        }
      }

      cleanNodes(spellBookBox);
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

//creates each spell display
function createSpell(spell, book, lvl) {
  if (spell.level != lvl) return;

  //creates the overall holder for the spell
  const spellHolder = document.createElement("section");
  spellHolder.classList.add("spell-hold");

  book
    ? spellBookBox.appendChild(spellHolder)
    : allSpellsBox.appendChild(spellHolder);

  //creates the holder for the spell quick details
  const spellSumm = document.createElement("div");
  spellSumm.classList.add("spell-min");
  spellHolder.appendChild(spellSumm);

  // create Spell Icon
  createHtml("img", null, spellSumm, ["spell-icon", spell.school.name]);

  //name of spell
  const nameHold = document.createElement("div");
  spellSumm.appendChild(nameHold);

  // create Spell Name
  createHtml("h4", spell.name, nameHold, null);

  //create spell school
  createHtml("p", spell.school.name, nameHold, "grey");

  //concentration & ritual
  const concHolder = document.createElement("div");
  concHolder.classList.add("w50");
  spellSumm.appendChild(concHolder);

  if (spell.concentration == true) createHtml("p", "Conc", concHolder, "green");
  if (spell.ritual == true) createHtml("p", "Ritual", concHolder, "red");

  //create range
  createHtml("p", spell.range, spellSumm, "w50");

  //damage + cost
  const damageHold = document.createElement("div");
  damageHold.classList.add("w50");
  spellSumm.appendChild(damageHold);

  //damage
  let dmg = null;

  if (spell.homebrew) if (spell.damage != null) dmg = spell.damage;

  if (spell.damage) {
    if (spell.damage.damage_at_character_level)
      dmg = spell.damage.damage_at_character_level[WIZ_LEVEL];
    if (spell.damage.damage_at_slot_level)
      dmg = spell.damage.damage_at_slot_level[spell.level];
  }

  dmg != null
    ? createHtml("p", dmg, damageHold, "text-center")
    : createHtml("p", "—", damageHold, "text-center");

  //cost
  let gold = spell.level * 50;

  if (spell.school.name == WIZ_SCHOOL) gold = gold / 2;
  if (gold > 0 && book == false)
    createHtml("p", `${gold}g`, damageHold, ["grey", "text-center"]);

  //create save
  const saveHold = document.createElement("div");
  saveHold.classList.add("w120");
  spellSumm.appendChild(saveHold);

  if (spell.dc && spell.dc.dc_type.name != null) {
    createHtml("p", `${spell.dc.dc_type.name} SAVE`, saveHold, "text-center");
  } else {
    createHtml("p", `—`, saveHold, "text-center");
  }

  // create Time
  let time = spell.level * 2;
  if (spell.school.name == WIZ_SCHOOL) time = time / 2;

  if (time > 0 && book == false)
    createHtml("p", `${time} hours`, saveHold, ["grey", "text-center"]);

  //PLUS BUTTON
  const plus = document.createElement("p");
  plus.textContent = "+";
  spellSumm.appendChild(plus);
  plus.addEventListener("click", expandSpell);
  classAdd(plus, "plus", `${spell.index}`);

  // EXTENDED SPELL DISPLAY
  const extendedSpell = document.createElement("div");
  extendedSpell.classList.add("spell-expand");
  spellHolder.appendChild(extendedSpell);
  plus.classList.add(`${spell.index}`);

  //create spell description
  spell.desc.forEach((elem) => {
    createHtml("p", elem, extendedSpell, ["desc", "hidden", `${spell.index}`]);
  });

  //create higher level
  if (spell.higher_level && spell.higher_level != null) {
    createHtml("p", spell.higher_level, extendedSpell, [
      "desc",
      "hidden",
      `${spell.index}`,
    ]);
  }

  const btnHolder = document.createElement("div");
  extendedSpell.appendChild(btnHolder);
  classAdd(btnHolder, ["flex", "right"]);

  const spellBtn = document.createElement("button");
  btnHolder.appendChild(spellBtn);
  classAdd(spellBtn, ["remove-btn", "hidden", `${spell.index}`]);

  if (book) {
    spellBtn.textContent = "Remove from Spellbook";
    spellBtn.addEventListener("click", removeSpell);
  } else {
    spellBtn.textContent = "Add to Spellbook";
    spellBtn.addEventListener("click", addSpelltoBook);
  }
}

//creates each level display
function createLvlLabels(selectText, book, b) {
  const label = document.createElement("h3");
  label.classList.add("label");
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

//expands indiv spell
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

//delete spell from spellbook
function removeSpell(e) {
  console.log("remove spell function");
  const spell = e.target.classList[1];

  axios
    .delete(`/api/book/${spell}`)
    .then((res) => {
      console.log(`deleted ${spell}`);
      e.target.parentNode.parentNode.parentNode.remove();
    })
    .catch((err) => {
      console.log(err);
    });
}

//add spell to spell book from all spells
function addSpelltoBook(e) {
  const spell = e.target.classList[1];
  //console.log(`/api/spells/${spell}`);
  axios
    .post(`/api/spells/${spell}`)
    .then(() => {
      pullBookSpells(e);
    })
    .then(() => {
      console.log(`${spell} added!`);
      e.target.parentNode.parentNode.parentNode.remove();
    })
    .catch((err) => {
      console.log(`${spell} error`, err);
    });
}

//create query for R, Conc & All btns (Book Spells)
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

//deletes extra level labels on display
function cleanNodes(box) {
  nodes = box.childNodes;

  for (let i = 0; i < nodes.length - 1; i++) {
    if (
      nodes[i].classList.contains("label") &&
      nodes[i].nextSibling.classList.contains("label")
    ) {
      nodes[i].remove();
      i--;
    }
  }

  if (nodes[nodes.length - 1].classList.contains("label")) {
    nodes[nodes.length - 1].remove();
  }

  if (nodes.length == 0) {
    const noSpellsHolder = document.createElement("div");
    classAdd(noSpellsHolder, ["flex", "center"]);
    box.appendChild(noSpellsHolder);

    const noSpells = document.createElement("h3");
    noSpells.textContent = "No Spells Selected!";
    noSpellsHolder.appendChild(noSpells);
  }
}

//creates HTML element
function createHtml(htmlType, value, parent, class_) {
  const elem = document.createElement(htmlType);
  if (value != null) elem.textContent = value;
  if (class_ != null) classAdd(elem, class_);
  parent.appendChild(elem);
}

//adds multiple classes to HTML element
function classAdd(elem, class_) {
  if (typeof class_ === "object") {
    class_.forEach((e) => {
      elem.classList.add(e);
    });
  } else {
    elem.classList.add(class_);
  }
}

//shows the Homebrew creation section
function showHomebrew() {
  hbBox.classList.contains("hidden")
    ? (addHbBtn.textContent = "Hide Homebrew..")
    : (addHbBtn.textContent = "Add Homebrew Spell");

  hbBox.classList.toggle("hidden");
}

//submit Homebrew and create Spell
function submitHomebrew() {
  const spellNameInput = document.getElementById("name-input");
  const levelInput = document.getElementById("level-input");
  const schoolInput = document.getElementById("school-input");
  const rangeInput = document.getElementById("range-input");
  const damageInput = document.getElementById("dmg-input");
  const dcInput = document.getElementById("dc-input");
  const descInput = document.getElementById("desc-input");
  const upcastInput = document.getElementById("upcast-input");

  //which boxes are checked
  const damageCheck = document.getElementById("dmg").checked;
  const concCheck = document.getElementById("conc").checked;
  const rituCheck = document.getElementById("ritu").checked;

  //check all inputs are valid
  let error = "";

  error = checkInput(spellNameInput.value, 50, error, "Spell Name");
  error = checkInput(rangeInput.value, 20, error, "Range");
  error = checkInput(descInput.value, 3000, error, "Description");
  error = checkInput(upcastInput.value, 1000, error, "Upcast");
  error = checkInput(damageInput.value, 20, error, "Damage");

  if (error != "") {
    hbNotif.classList.remove("hidden");
    hbNotif.textContent = `ERROR: ${error}`;
    return;
  } else {
    hbNotif.classList.add("hidden");
    hbNotif.textContent = "";
  }

  //assign input values
  const newName = spellNameInput.value.trim();
  const newIndex = createIndex(newName);
  //need to add an axios call to check if index already exists
  const newLevel = levelInput.value;
  const newSchool = schoolInput.value;
  const newRange = rangeInput.value.trim();
  const newDesc = descInput.value.trim();

  damageCheck && damageInput.value != ""
    ? (newDamage = damageInput.value.trim())
    : (newDamage = null);

  let newDc = null;
  if (dcInput.value != "noSave") newDc = dcInput.value;

  let newUpcast = null;
  if (upcastInput.value != "") newUpcast = upcastInput.value.trim();

  //create object to send to server
  const newSpell = {
    level: newLevel,
    school: newSchool,
    name: newName,
    concentration: concCheck,
    ritual: rituCheck,
    range: newRange,
    damage: newDamage,
    dc: newDc,
    index: newIndex,
    description: newDesc,
    higher_level: newUpcast,
    homebrew: true,
  };

  console.log(newSpell);
}

//check that User Input is correct
function checkInput(input, length, error, value) {
  //check length of input
  if (input.length >= length) {
    error += `${value} is too long // `;
  }

  if (input.length <= 0 && (value == "Range" || value == "Spell Name")) {
    error += `${value} must exist // `;
  } else {
    //check that it starts with an alphebetic character
    if (input.length > 0) {
      if (!/^[A-Za-z0-9]/.test(input)) {
        error += `${value} does not start with an alphanumeric character // `;
      }
    }
  }

  //check that it doesnt include ' which will break sql
  if (input.includes("'")) {
    error += `${value} includes the value ' // `;
  }

  //checks that it doesn't include " which messes with display
  if (input.includes('"')) {
    error += `${value} includes the value " // `;
  }

  //console.log(`${input} checked: ${flag}`);
  return error;
}

//create Spell Index from Spell Name
function createIndex(name) {
  const regex = /[$&+,:"`;=?@#|<>.^*()%!]/g;

  let index = name.toLowerCase().trim();
  index = index.replaceAll(" ", "-");
  index = index.replaceAll(regex, "-");

  //console.log(`${index} created from ${name}`);
  return index;
}

//clear the homebrew inputs
function clearHb() {
  document.getElementById("name-input").value = "";
  document.getElementById("level-input").value = "0";
  document.getElementById("school-input").value = "Illusion";
  document.getElementById("range-input").value = "";
  document.getElementById("dmg-input").value = "";
  document.getElementById("dc-input").value = "noSave";
  document.getElementById("desc-input").value = "";
  document.getElementById("upcast-input").value = "";

  //which boxes are checked
  document.getElementById("dmg").checked = false;
  document.getElementById("conc").checked = false;
  document.getElementById("ritu").checked = false;

  //disable damage input
  document.getElementById("dmg-input").setAttribute("disabled", "");
}

function toggleDmg() {
  if (hbDamage.checked == true) {
    document.getElementById("dmg-input").removeAttribute("disabled");
  } else {
    document.getElementById("dmg-input").setAttribute("disabled", "");
  }
}
